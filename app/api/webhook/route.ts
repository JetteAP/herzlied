import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { PACKAGES, isValidPackageId, type PackageId } from "@/lib/packages";
import { BRAND } from "@/lib/brand";
import { writeLyrics } from "@/lib/lyrics";
import { composeSong } from "@/lib/elevenlabs";
import {
  buildMusicPrompt,
  buildEmailHtml,
  type SongAnswers,
} from "@/lib/songPrompt";

let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });
  }
  return _stripe;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Songgenerierung kann 1–3 Min dauern (Lyrics + bis zu 2 Songs).
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const sessionId = session.id;

  // Nur EIGENE Events verarbeiten (gleiches Stripe-Konto kann mehrere
  // Projekte bedienen). Alles ohne unseren Namespace ignorieren.
  {
    const m = session.metadata ?? {};
    if (m.ns !== BRAND.orderNamespace || !m.package || !isValidPackageId(m.package)) {
      console.log(`[Webhook] Ignoring ${sessionId} — not a ${BRAND.name} order`);
      return NextResponse.json({ received: true, ignored: true });
    }
  }

  // Frische Metadata holen + Idempotenz (Stripe wiederholt das Event).
  const fresh = await getStripe().checkout.sessions.retrieve(sessionId);
  const meta = fresh.metadata ?? {};

  if (meta.email_sent_at) {
    console.log(`[Webhook] Skipping ${sessionId} — already delivered`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  const lockAgeMs = meta.processing_started_at
    ? Date.now() - Number(meta.processing_started_at)
    : Infinity;
  if (lockAgeMs < 15 * 60 * 1000) {
    console.log(`[Webhook] Skipping ${sessionId} — lock held (age ${lockAgeMs}ms)`);
    return NextResponse.json({ received: true, locked: true });
  }

  await getStripe().checkout.sessions.update(sessionId, {
    metadata: { ...meta, processing_started_at: String(Date.now()) },
  });

  const packageId: PackageId = meta.package as PackageId;
  const answers: SongAnswers = {
    recipient_name: meta.recipient_name ?? "",
    relationship: meta.relationship ?? "sonstiges",
    relationship_other: meta.relationship_other ?? "",
    sender_name: meta.sender_name ?? "",
    occasion: meta.occasion ?? "einfach_so",
    occasion_other: meta.occasion_other ?? "",
    genre: meta.genre ?? "pop_ballade",
    mood: meta.mood ?? "emotional",
    voice: meta.voice ?? "egal",
    language: meta.language ?? "de",
    story_memory: meta.story_memory ?? "",
    story_traits: meta.story_traits ?? "",
    story_inside: meta.story_inside ?? "",
    story_message: meta.story_message ?? "",
    email: meta.email ?? fresh.customer_email ?? "",
    package: packageId,
  };

  try {
    await processOrder(answers);
    await getStripe().checkout.sessions.update(sessionId, {
      metadata: { ...meta, email_sent_at: String(Date.now()) },
    });
  } catch (e) {
    console.error("Order processing failed:", e);
    // Lock lösen, damit Stripes nächster Retry es erneut versucht.
    await getStripe()
      .checkout.sessions.update(sessionId, {
        metadata: { ...meta, processing_started_at: "" },
      })
      .catch(() => {});
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ============ CORE ORDER PROCESSING ============

async function processOrder(a: SongAnswers) {
  const pkg = PACKAGES[a.package ?? "basis"];
  console.log(`[Order] Processing ${pkg.id} for ${a.email} (recipient: ${a.recipient_name})`);

  // 1) Persönliche Songtexte (optional via OpenAI; sonst schreibt ElevenLabs sie)
  const lyrics = await writeLyrics(a);
  console.log(`[Order] Lyrics ${lyrics ? "written by OpenAI" : "delegated to ElevenLabs"}`);

  // 2) Song(s) generieren — bei Premium parallel zwei Varianten
  const variantCount = Math.max(1, pkg.variants);
  const songs = await Promise.all(
    Array.from({ length: variantCount }, (_, i) =>
      composeSong({
        prompt: buildMusicPrompt(a, lyrics, i),
        lengthMs: pkg.lengthMs,
      })
    )
  );
  console.log(`[Order] ${songs.length} song(s) generated for ${a.email}`);

  // 3) Anhänge + Datei-Labels
  const safeName = (a.recipient_name || "song")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const attachments: nodemailer.SendMailOptions["attachments"] = [];
  const fileLabels: string[] = [];

  songs.forEach((buf, i) => {
    const suffix = songs.length > 1 ? `-variante-${i + 1}` : "";
    attachments.push({
      filename: `herzlied-${safeName || "song"}${suffix}.mp3`,
      content: buf,
      contentType: "audio/mpeg",
    });
    fileLabels.push(
      songs.length > 1
        ? `Dein Song für ${a.recipient_name}, Variante ${i + 1} (MP3)`
        : `Dein Song für ${a.recipient_name} (MP3)`
    );
  });

  // 4) Liefer-E-Mail
  await sendOrderEmail(a, attachments, lyrics, fileLabels);
  console.log(`[Order] ✓ Delivered to ${a.email} (${pkg.id})`);
}

async function sendOrderEmail(
  a: SongAnswers,
  attachments: nodemailer.SendMailOptions["attachments"],
  lyrics: string,
  fileLabels: string[]
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: a.email,
    subject: `Dein Song für ${a.recipient_name} ist fertig`,
    html: buildEmailHtml(a, { lyrics, fileLabels }),
    attachments,
  });
}
