import type { PackageId } from "./packages";
import { BRAND } from "./brand";

export type SongAnswers = {
  recipient_name: string; // Name des/der Beschenkten
  relationship: string; // Beziehung (id, siehe RELATIONSHIPS)
  relationship_other: string; // Freitext, falls relationship === "sonstiges"
  sender_name: string; // Dein Name
  occasion: string; // Anlass (id, siehe OCCASIONS)
  occasion_other: string; // Freitext, falls occasion === "andere"
  genre: string; // Musikstil (id, siehe GENRES)
  mood: string; // Stimmung (id, siehe MOODS)
  voice: string; // Stimme (id, siehe VOICES)
  language: string; // "de" | "en"
  // Das Herzstück — in vier gezielte Fragen aufgeteilt:
  story_memory: string; // Schönste gemeinsame Erinnerung / besonderer Moment
  story_traits: string; // Was die Person besonders macht
  story_inside: string; // Insider, Spitznamen, gemeinsame Dinge
  story_message: string; // Die Botschaft, die der Song vermitteln soll
  email: string;
  package?: PackageId;
};

// ============ MAPPINGS (UI-id -> Beschreibung) ============

type RelInfo = { de: string; en: string };
export const RELATIONSHIPS: Record<string, RelInfo> = {
  mutter: { de: "meine Mutter", en: "their mother" },
  vater: { de: "mein Vater", en: "their father" },
  partnerin: { de: "meine Partnerin", en: "their girlfriend/wife" },
  partner: { de: "mein Partner", en: "their boyfriend/husband" },
  freundin: { de: "meine beste Freundin", en: "their best friend (female)" },
  freund: { de: "mein bester Freund", en: "their best friend (male)" },
  oma: { de: "meine Oma", en: "their grandmother" },
  opa: { de: "mein Opa", en: "their grandfather" },
  kind: { de: "mein Kind", en: "their child" },
  schwester: { de: "meine Schwester", en: "their sister" },
  bruder: { de: "mein Bruder", en: "their brother" },
  sonstiges: { de: "ein besonderer Mensch", en: "a very special person" },
};

export const OCCASIONS: Record<string, string> = {
  geburtstag: "zum Geburtstag",
  muttertag: "zum Muttertag",
  vatertag: "zum Vatertag",
  jahrestag: "zum Jahrestag",
  hochzeit: "zur Hochzeit",
  weihnachten: "zu Weihnachten",
  valentinstag: "zum Valentinstag",
  einfach_so: "einfach so, aus Liebe",
  andere: "zu einem besonderen Anlass",
};

// Englische Anlass-Beschreibungen — für die Song-Prompts (damit kein
// deutscher Schnipsel die Songsprache verfälscht).
const OCCASIONS_EN: Record<string, string> = {
  geburtstag: "for a birthday",
  muttertag: "for Mother's Day",
  vatertag: "for Father's Day",
  jahrestag: "for an anniversary",
  hochzeit: "for a wedding",
  weihnachten: "for Christmas",
  valentinstag: "for Valentine's Day",
  einfach_so: "just to say I love them",
  andere: "for a special occasion",
};

type StyleInfo = { de: string; prompt: string };
export const GENRES: Record<string, StyleInfo> = {
  pop_ballade: {
    de: "Pop-Ballade",
    prompt:
      "a heartfelt modern pop ballad, slow to mid tempo, with grand piano, warm strings and a soaring emotional chorus, glossy professional radio production, mature and tasteful, never cheesy or childish",
  },
  akustik: {
    de: "Akustik / Singer-Songwriter",
    prompt:
      "an intimate acoustic singer-songwriter song, gentle mid tempo, fingerpicked acoustic guitar, warm organic and sincere, polished modern production, never childish",
  },
  folk_indie: {
    de: "Indie-Folk",
    prompt:
      "a warm modern indie-folk song, upbeat mid tempo, acoustic guitar, foot-stomping live drums and hand claps, heartfelt and uplifting, polished professional production, never childish",
  },
  rock: {
    de: "Pop / Mitreißend",
    prompt:
      "a modern uplifting feel-good pop song with a steady danceable beat, mid tempo around 110 BPM, warm guitars, real drums, bass and a big catchy chorus, romantic and celebratory, glossy professional radio production like a contemporary chart hit, absolutely NOT childish, NOT a nursery rhyme, NOT cheesy",
  },
  schlager: {
    de: "Schlager / Feel-Good",
    prompt:
      "a modern feel-good German pop schlager, upbeat and catchy with a danceable beat, warm and singalong, polished contemporary production, tasteful and never cheesy",
  },
  rnb_soul: {
    de: "R&B / Soul",
    prompt:
      "a warm mid-tempo pop-soul groove with a relaxed danceable beat around 100 BPM, smooth chords, subtle live drums and emotive vocals, modern professional production, romantic and groovy but never sleepy or slow",
  },
  hiphop: {
    de: "Melodischer Hip-Hop",
    prompt:
      "a modern melodic pop-rap song with a clean danceable beat, a catchy sung emotional hook and warm verses, polished contemporary production",
  },
  epic: {
    de: "Cinematic / Episch",
    prompt:
      "a cinematic emotional pop song building from soft to powerful, lush orchestral elements, big drums and a climactic chorus, modern film-score-meets-pop production, mature and grand",
  },
};

export const MOODS: Record<string, StyleInfo> = {
  emotional: { de: "Emotional & berührend", prompt: "deeply emotional, heartfelt, tender and moving" },
  froehlich: { de: "Fröhlich & beschwingt", prompt: "joyful, upbeat, celebratory and feel-good" },
  romantisch: { de: "Romantisch", prompt: "romantic, warm, loving and intimate" },
  kraftvoll: { de: "Kraftvoll & motivierend", prompt: "powerful, anthemic, uplifting and triumphant" },
  nostalgisch: { de: "Nostalgisch", prompt: "nostalgic, warm, reflective and bittersweet" },
  humorvoll: { de: "Humorvoll & verspielt", prompt: "playful, light-hearted, cheeky and fun" },
};

export const VOICES: Record<string, string> = {
  weiblich: "a female lead vocalist",
  maennlich: "a male lead vocalist",
  egal: "a fitting lead vocalist",
};

export const LANGUAGES: Record<string, { de: string; en: string }> = {
  de: { de: "Deutsch", en: "German" },
  en: { de: "Englisch", en: "English" },
};

// ============ HELPERS ============

function rel(a: SongAnswers): RelInfo {
  // Eigener Freitext schlägt die feste Liste, wenn "Jemand Besonderes" gewählt wurde.
  if (a.relationship === "sonstiges" && a.relationship_other?.trim()) {
    const t = a.relationship_other.trim();
    return { de: t, en: t };
  }
  return RELATIONSHIPS[a.relationship] ?? RELATIONSHIPS.sonstiges;
}
function occ(a: SongAnswers): string {
  if (a.occasion === "andere" && a.occasion_other?.trim()) {
    return a.occasion_other.trim();
  }
  return OCCASIONS[a.occasion] ?? OCCASIONS.einfach_so;
}
function occEn(a: SongAnswers): string {
  if (a.occasion === "andere" && a.occasion_other?.trim()) {
    return `for this occasion: ${a.occasion_other.trim()}`;
  }
  return OCCASIONS_EN[a.occasion] ?? OCCASIONS_EN.einfach_so;
}
function genre(a: SongAnswers): StyleInfo {
  return GENRES[a.genre] ?? GENRES.pop_ballade;
}
function mood(a: SongAnswers): StyleInfo {
  return MOODS[a.mood] ?? MOODS.emotional;
}
function voice(a: SongAnswers): string {
  return VOICES[a.voice] ?? VOICES.egal;
}
function lang(a: SongAnswers): { de: string; en: string } {
  return LANGUAGES[a.language] ?? LANGUAGES.de;
}

/** Baut aus den vier Detail-Fragen einen strukturierten Material-Block. */
function storyDetails(a: SongAnswers): string {
  const parts: string[] = [];
  if (a.story_memory?.trim())
    parts.push(`- Shared memory / special moment: ${a.story_memory.trim()}`);
  if (a.story_traits?.trim())
    parts.push(`- What makes ${a.recipient_name} special (traits, quirks): ${a.story_traits.trim()}`);
  if (a.story_inside?.trim())
    parts.push(`- Inside references, nicknames, shared favourites: ${a.story_inside.trim()}`);
  if (a.story_message?.trim())
    parts.push(`- The core message the song should convey: ${a.story_message.trim()}`);
  return parts.join("\n");
}

// ============ LYRICS BRIEF (für OpenAI) ============

/**
 * Baut den Auftrag an das Sprachmodell, das die persönlichen Songtexte schreibt.
 * Das Modell soll NUR die fertigen Lyrics mit Abschnitts-Tags zurückgeben.
 */
export function buildLyricsBrief(a: SongAnswers): { system: string; user: string } {
  const r = rel(a);
  const language = lang(a).en;

  const system = [
    `CRITICAL LANGUAGE RULE: Write the ENTIRE song — every single line of lyrics — in ${language} ONLY. The customer's input details below may be written in another language (e.g. German), but you MUST translate the meaning and write the finished lyrics exclusively in ${language}. Do not mix languages. This rule overrides everything else.`,
    `You are a world-class professional songwriter who writes deeply personal gift songs.`,
    `You write singable, emotionally resonant lyrics that avoid clichés and never feel generic or cheesy.`,
    `You weave in the SPECIFIC concrete details the customer provides (real names, shared memories, inside references, personality traits) so the song could only ever be about this one person.`,
    `PERSPECTIVE: The song is sung by ${a.sender_name || "the gift-giver"} TO ${a.recipient_name}, who is the gift-giver's ${r.de}. Address ${a.recipient_name} directly and warmly (in second person). Only use terms of endearment that genuinely fit this relationship — for a parent or grandparent, NEVER use romantic pet names like "Schatz", "Liebling" or "Baby" to address them. If the customer mentions a nickname that the recipient uses for the gift-giver (e.g. "she calls me Schatz"), do NOT use it to address the recipient; you may mention it from the gift-giver's side ("you always called me ...") or simply leave it out. When in doubt, address the recipient by their name.`,
    `Again: the lyrics must be written in ${language}.`,
    `Structure the song with clearly labelled sections using square-bracket tags on their own lines, exactly like:`,
    `[Verse 1] ... [Chorus] ... [Verse 2] ... [Chorus] ... [Bridge] ... [Chorus]`,
    `Keep each line short enough to be sung comfortably. Total length should suit a song of roughly ${Math.round(
      (a.package === "premium" ? 150 : 90)
    )} seconds.`,
    `Output ONLY the lyrics with the section tags. No title, no explanation, no commentary, no markdown.`,
  ].join("\n");

  const user = [
    `Write a personal gift song. (Reminder: lyrics in ${language} only.)`,
    `From: ${a.sender_name || "someone who loves them"}`,
    `For: ${a.recipient_name} (${r.en})`,
    `Occasion: ${occEn(a)}`,
    `Desired style/genre: ${genre(a).prompt}`,
    `Desired mood: ${mood(a).prompt}`,
    ``,
    `The customer provided these concrete details about ${a.recipient_name} — weave them into the lyrics:`,
    `"""`,
    storyDetails(a) || "(no extra details provided — write a warm, loving song based on the relationship and occasion)",
    `"""`,
    ``,
    `Remember: mention ${a.recipient_name} by name, make it specific, make it heartfelt. If a core message was given, let the chorus carry it.`,
  ].join("\n");

  return { system, user };
}

// ============ MUSIC PROMPT (für ElevenLabs) ============

/**
 * Baut den finalen Prompt für ElevenLabs Music.
 * Wenn `lyrics` vorhanden sind, werden sie wörtlich vorgegeben.
 * Sonst beschreibt der Prompt das Thema und ElevenLabs schreibt die Lyrics selbst.
 */
export function buildMusicPrompt(
  a: SongAnswers,
  lyrics: string,
  variantIndex = 0
): string {
  const langName = lang(a).en;
  const styleLine = `IMPORTANT: all vocals and lyrics must be in ${langName}. A ${langName}-language song with ${voice(
    a
  )}. ${mood(a).prompt}. ${genre(a).prompt}. Polished, professional, emotionally engaging modern studio production with a clear, memorable melody and a strong chorus. Mature adult contemporary sound, never childish, never a nursery rhyme.`;

  const variantHint =
    variantIndex === 0
      ? ""
      : ` Alternative interpretation: a slightly different tempo, key and instrumentation than the first version while keeping the same lyrics and mood.`;

  if (lyrics && lyrics.trim()) {
    return [
      `${styleLine}${variantHint}`,
      `A personalised gift song for ${a.recipient_name}, ${occEn(a)}.`,
      `Use these exact lyrics, respecting the [section] tags (the lyrics are already in ${langName} — sing them exactly as written):`,
      ``,
      lyrics.trim(),
    ].join("\n");
  }

  // Fallback ohne vorab generierte Lyrics
  const storyHint = storyDetails(a).replace(/\n/g, " ").replace(/\s+/g, " ").slice(0, 600);
  return [
    `${styleLine}${variantHint}`,
    `Write and perform a personalised gift song (lyrics in ${langName} only) for ${a.recipient_name} (${rel(a).en}), ${occEn(a)}.`,
    `The lyrics should mention ${a.recipient_name} by name and reflect this: ${storyHint || "a warm, loving message"}.`,
  ].join("\n");
}

// ============ DELIVERY EMAIL ============

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Formatiert die Lyrics (mit [Tags]) hübsch für die E-Mail. */
function lyricsToHtml(lyrics: string): string {
  if (!lyrics || !lyrics.trim()) return "";
  return lyrics
    .trim()
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t) return `<div style="height:10px;"></div>`;
      const isTag = /^\[.+\]$/.test(t);
      if (isTag) {
        return `<p style="font-family:'Inter',sans-serif; font-size:11px; letter-spacing:0.25em; text-transform:uppercase; color:#e7c6a0; margin:18px 0 6px; font-weight:600;">${escapeHtml(
          t.replace(/[\[\]]/g, "")
        )}</p>`;
      }
      return `<p style="font-family:'Fraunces',Georgia,serif; font-size:17px; line-height:1.5; color:#f4ede2; margin:2px 0;">${escapeHtml(
        t
      )}</p>`;
    })
    .join("");
}

export function buildEmailHtml(
  a: SongAnswers,
  opts: { lyrics?: string; fileLabels: string[] }
): string {
  const r = rel(a);
  const lyricsHtml = opts.lyrics ? lyricsToHtml(opts.lyrics) : "";
  const filesList = opts.fileLabels
    .map(
      (f) =>
        `<li style="margin-bottom:6px; font-family:'Inter',sans-serif; font-size:15px; color:#d8cfc2;">${escapeHtml(
          f
        )}</li>`
    )
    .join("");

  return `
  <div style="background:#141010; padding:0; margin:0;">
    <div style="max-width:600px; margin:0 auto; padding:46px 30px 40px; background:#141010;">
      <div style="text-align:center; margin-bottom:30px;">
        <p style="font-family:'Inter',sans-serif; font-size:11px; letter-spacing:0.4em; text-transform:uppercase; color:#e7c6a0; margin:0 0 14px; font-weight:600;">${escapeHtml(
          BRAND.name
        )}</p>
        <h1 style="margin:0; font-family:'Fraunces',Georgia,serif; font-size:30px; font-weight:500; color:#f4ede2; line-height:1.2;">Dein Song für ${escapeHtml(
          a.recipient_name
        )} ist fertig</h1>
      </div>

      <p style="font-family:'Inter',sans-serif; font-size:16px; line-height:1.7; color:#d8cfc2;">Hallo${
        a.sender_name ? " " + escapeHtml(a.sender_name) : ""
      },</p>
      <p style="font-family:'Inter',sans-serif; font-size:16px; line-height:1.7; color:#d8cfc2;">
        dein ganz persönlicher Song für ${escapeHtml(r.de)} (${escapeHtml(
    a.recipient_name
  )}) ${escapeHtml(occ(a))} ist fertig, geschrieben und komponiert allein aus deiner Geschichte.
        Du findest die Audiodatei${
          opts.fileLabels.length > 1 ? "en" : ""
        } im Anhang dieser E-Mail.
      </p>

      <div style="margin:28px 0; padding:20px 24px; background:rgba(231,198,160,0.08); border:1px solid rgba(231,198,160,0.25); border-radius:14px;">
        <p style="font-family:'Inter',sans-serif; font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:#e7c6a0; margin:0 0 12px; font-weight:600;">Im Anhang</p>
        <ul style="margin:0; padding-left:20px;">${filesList}</ul>
      </div>

      ${
        lyricsHtml
          ? `<div style="margin:32px 0; padding:26px 26px; background:#201a17; border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
              <p style="font-family:'Inter',sans-serif; font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:#e7c6a0; margin:0 0 14px; font-weight:600;">Der Songtext</p>
              ${lyricsHtml}
            </div>`
          : ""
      }

      <p style="font-family:'Inter',sans-serif; font-size:15px; line-height:1.7; color:#a99d8f; margin-top:30px;">
        Tipp: Lade die MP3 herunter und spiel sie ${escapeHtml(
          a.recipient_name
        )} im richtigen Moment vor, oder verschick ihn als kleine Überraschung.
      </p>

      <div style="text-align:center; margin:40px 0 0;">
        <div style="display:inline-block; width:40px; height:1px; background:rgba(231,198,160,0.5);"></div>
      </div>
      <p style="font-family:'Inter',sans-serif; font-size:13px; color:#a99d8f; text-align:center; margin:20px 0 0;">${escapeHtml(
        BRAND.name
      )} · ${escapeHtml(BRAND.supportEmail)}</p>
    </div>
  </div>`;
}
