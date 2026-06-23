import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PACKAGES, isValidPackageId } from "@/lib/packages";
import { BRAND } from "@/lib/brand";

let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });
  }
  return _stripe;
}

type ClientPayload = {
  pkg: string;
  answers: Record<string, string>;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ClientPayload;
    const { pkg: pkgId, answers } = body;

    if (!pkgId || !answers) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }
    if (!isValidPackageId(pkgId)) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const pkg = PACKAGES[pkgId];

    // Pflichtfelder, ohne die wir keinen Song erstellen können.
    const required = [
      "recipient_name",
      "relationship",
      "occasion",
      "genre",
      "story_memory",
      "email",
    ];
    for (const k of required) {
      if (!answers[k] || !answers[k].trim()) {
        return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
      }
    }
    // Wenn "Andere"/"Jemand Besonderes" gewählt wurde, muss der Freitext da sein.
    if (answers.occasion === "andere" && !answers.occasion_other?.trim()) {
      return NextResponse.json({ error: "Missing field: occasion_other" }, { status: 400 });
    }
    if (answers.relationship === "sonstiges" && !answers.relationship_other?.trim()) {
      return NextResponse.json({ error: "Missing field: relationship_other" }, { status: 400 });
    }

    // Stripe-Metadata: max 50 Keys, 500 Zeichen pro Wert.
    // orderNamespace markiert das Event als zu DIESEM Projekt gehörig.
    const metadata: Record<string, string> = {
      ns: BRAND.orderNamespace,
      package: pkgId,
      recipient_name: answers.recipient_name.slice(0, 100),
      relationship: answers.relationship.slice(0, 60),
      relationship_other: (answers.relationship_other ?? "").slice(0, 120),
      sender_name: (answers.sender_name ?? "").slice(0, 100),
      occasion: answers.occasion.slice(0, 60),
      occasion_other: (answers.occasion_other ?? "").slice(0, 120),
      genre: answers.genre.slice(0, 60),
      mood: (answers.mood ?? "").slice(0, 60),
      voice: (answers.voice ?? "").slice(0, 40),
      language: (answers.language ?? "de").slice(0, 10),
      story_memory: (answers.story_memory ?? "").slice(0, 480),
      story_traits: (answers.story_traits ?? "").slice(0, 480),
      story_inside: (answers.story_inside ?? "").slice(0, 480),
      story_message: (answers.story_message ?? "").slice(0, 480),
      email: answers.email.slice(0, 200),
    };

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: answers.email,
      locale: "de",
      ...({ adaptive_pricing: { enabled: false } } as any),
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${BRAND.name} · Persönlicher Song (${pkg.name})`,
              description: pkg.tagline,
            },
            unit_amount: pkg.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&pkg=${pkgId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
