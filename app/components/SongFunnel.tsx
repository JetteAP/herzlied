"use client";

import { useState } from "react";
import { PACKAGES, formatPrice, type PackageId } from "@/lib/packages";

type Choice = { id: string; label: string; emoji?: string; hint?: string };

const RELATIONSHIPS: Choice[] = [
  { id: "mutter", label: "Meine Mutter", emoji: "💜" },
  { id: "vater", label: "Mein Vater", emoji: "💙" },
  { id: "partnerin", label: "Meine Partnerin", emoji: "❤️" },
  { id: "partner", label: "Mein Partner", emoji: "❤️" },
  { id: "freundin", label: "Beste Freundin", emoji: "🌸" },
  { id: "freund", label: "Bester Freund", emoji: "🤝" },
  { id: "oma", label: "Meine Oma", emoji: "🌷" },
  { id: "opa", label: "Mein Opa", emoji: "🌟" },
  { id: "kind", label: "Mein Kind", emoji: "🧸" },
  { id: "schwester", label: "Meine Schwester", emoji: "💞" },
  { id: "bruder", label: "Mein Bruder", emoji: "💪" },
  { id: "sonstiges", label: "Andere…", emoji: "✨" },
];

const OCCASIONS: Choice[] = [
  { id: "geburtstag", label: "Geburtstag", emoji: "🎂" },
  { id: "muttertag", label: "Muttertag", emoji: "💐" },
  { id: "vatertag", label: "Vatertag", emoji: "🎩" },
  { id: "jahrestag", label: "Jahrestag", emoji: "💞" },
  { id: "hochzeit", label: "Hochzeit", emoji: "💍" },
  { id: "weihnachten", label: "Weihnachten", emoji: "🎄" },
  { id: "valentinstag", label: "Valentinstag", emoji: "❤️" },
  { id: "einfach_so", label: "Einfach so", emoji: "✨" },
  { id: "andere", label: "Anderer Anlass…", emoji: "📝" },
];

const GENRES: Choice[] = [
  { id: "pop_ballade", label: "Pop-Ballade", hint: "Klavier, Streicher, große Gefühle" },
  { id: "akustik", label: "Akustik", hint: "Gitarre, intim, ehrlich" },
  { id: "folk_indie", label: "Indie-Folk", hint: "warm, handgemacht" },
  { id: "rock", label: "Pop-Rock", hint: "kraftvoll, mitreißend" },
  { id: "schlager", label: "Schlager", hint: "fröhlich, zum Mitsingen" },
  { id: "rnb_soul", label: "R&B / Soul", hint: "soulful, groovy" },
  { id: "hiphop", label: "Hip-Hop", hint: "Beat + gesungener Hook" },
  { id: "epic", label: "Episch", hint: "cineastisch, Gänsehaut" },
];

const MOODS: Choice[] = [
  { id: "emotional", label: "Emotional & berührend", emoji: "🥹" },
  { id: "froehlich", label: "Fröhlich & beschwingt", emoji: "😄" },
  { id: "romantisch", label: "Romantisch", emoji: "💕" },
  { id: "kraftvoll", label: "Kraftvoll & motivierend", emoji: "🔥" },
  { id: "nostalgisch", label: "Nostalgisch", emoji: "🕰️" },
  { id: "humorvoll", label: "Humorvoll & verspielt", emoji: "😉" },
];

const VOICES: Choice[] = [
  { id: "weiblich", label: "Weibliche Stimme", emoji: "👩‍🎤" },
  { id: "maennlich", label: "Männliche Stimme", emoji: "🎤" },
  { id: "egal", label: "Egal / passend", emoji: "🎶" },
];

const LANGUAGES: Choice[] = [
  { id: "de", label: "Deutsch", emoji: "🇩🇪" },
  { id: "en", label: "Englisch", emoji: "🇬🇧" },
];

type Answers = {
  recipient_name: string;
  relationship: string;
  relationship_other: string;
  sender_name: string;
  occasion: string;
  occasion_other: string;
  genre: string;
  mood: string;
  voice: string;
  language: string;
  story_memory: string;
  story_traits: string;
  story_inside: string;
  story_message: string;
  email: string;
};

const EMPTY: Answers = {
  recipient_name: "",
  relationship: "",
  relationship_other: "",
  sender_name: "",
  occasion: "",
  occasion_other: "",
  genre: "",
  mood: "",
  voice: "",
  language: "de",
  story_memory: "",
  story_traits: "",
  story_inside: "",
  story_message: "",
  email: "",
};

const TOTAL_STEPS = 11;
const EMAIL_STEP = 10;

export default function SongFunnel() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [pkg, setPkg] = useState<PackageId>("basis");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof Answers, v: string) => setA((p) => ({ ...p, [k]: v }));

  const next = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  // Name (Platzhalter für die Story-Fragen)
  const who = a.recipient_name.trim() || "die Person";

  // Auswahl-Schritte springen automatisch weiter
  const choose = (k: keyof Answers, v: string) => {
    set(k, v);
    setTimeout(next, 180);
  };

  const canContinue = (): boolean => {
    switch (step) {
      case 0:
        return (
          a.recipient_name.trim().length > 0 &&
          a.relationship.length > 0 &&
          (a.relationship !== "sonstiges" || a.relationship_other.trim().length > 0)
        );
      case 1:
        return (
          a.occasion.length > 0 &&
          (a.occasion !== "andere" || a.occasion_other.trim().length > 0)
        );
      case 2:
        return a.genre.length > 0;
      case 3:
        return a.mood.length > 0;
      case 4:
        return a.voice.length > 0 && a.language.length > 0;
      case 5:
        return a.story_memory.trim().length >= 10; // Herzstück: Pflicht
      case 6:
      case 7:
      case 8:
        return true; // weitere Detail-Fragen: optional
      case 9:
        return true; // Paket immer gewählt
      case EMAIL_STEP:
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.email.trim());
      default:
        return false;
    }
  };

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pkg, answers: a }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Checkout");
      if (data.url) window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || "Etwas ist schiefgelaufen.");
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "0", overflow: "hidden" }}>
      {/* Progress */}
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)" }}>
        <div
          style={{
            height: "100%",
            width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
            background: "var(--gradient)",
            transition: "width 0.35s ease",
          }}
        />
      </div>

      <div style={{ padding: "34px 30px 30px" }}>
        <p className="eyebrow" style={{ marginBottom: 18 }}>
          Schritt {step + 1} von {TOTAL_STEPS}
        </p>

        {/* STEP 0 — Empfänger */}
        {step === 0 && (
          <Step title="Für wen ist der Song?">
            <input
              className="fld"
              placeholder="Name des/der Beschenkten, z. B. Mama oder Lena"
              value={a.recipient_name}
              onChange={(e) => set("recipient_name", e.target.value)}
              autoFocus
            />
            <p className="sublabel">Wer ist diese Person für dich?</p>
            <ChoiceGrid
              choices={RELATIONSHIPS}
              value={a.relationship}
              onPick={(v) => set("relationship", v)}
              cols={3}
            />
            {a.relationship === "sonstiges" && (
              <input
                className="fld"
                style={{ marginTop: 12 }}
                placeholder="Wer ist diese Person? z. B. meine Patentante, mein Kollege …"
                value={a.relationship_other}
                onChange={(e) => set("relationship_other", e.target.value)}
                autoFocus
              />
            )}
          </Step>
        )}

        {/* STEP 1 — Anlass */}
        {step === 1 && (
          <Step title="Was ist der Anlass?">
            <ChoiceGrid
              choices={OCCASIONS}
              value={a.occasion}
              onPick={(v) => (v === "andere" ? set("occasion", v) : choose("occasion", v))}
              cols={2}
            />
            {a.occasion === "andere" && (
              <input
                className="fld"
                style={{ marginTop: 12 }}
                placeholder="Welcher Anlass? z. B. Schulabschluss, Einzug, Versöhnung …"
                value={a.occasion_other}
                onChange={(e) => set("occasion_other", e.target.value)}
                autoFocus
              />
            )}
          </Step>
        )}

        {/* STEP 2 — Genre */}
        {step === 2 && (
          <Step title="Welcher Musikstil?">
            <ChoiceGrid
              choices={GENRES}
              value={a.genre}
              onPick={(v) => choose("genre", v)}
              cols={2}
            />
          </Step>
        )}

        {/* STEP 3 — Stimmung */}
        {step === 3 && (
          <Step title="Welche Stimmung soll der Song haben?">
            <ChoiceGrid
              choices={MOODS}
              value={a.mood}
              onPick={(v) => choose("mood", v)}
              cols={2}
            />
          </Step>
        )}

        {/* STEP 4 — Stimme + Sprache */}
        {step === 4 && (
          <Step title="Stimme & Sprache">
            <p className="sublabel">Gesangsstimme</p>
            <ChoiceGrid
              choices={VOICES}
              value={a.voice}
              onPick={(v) => set("voice", v)}
              cols={3}
            />
            <p className="sublabel" style={{ marginTop: 22 }}>
              Sprache des Songs
            </p>
            <ChoiceGrid
              choices={LANGUAGES}
              value={a.language}
              onPick={(v) => set("language", v)}
              cols={2}
            />
          </Step>
        )}

        {/* STEP 5 — Erinnerung (Pflicht) */}
        {step === 5 && (
          <Step title={`Eure schönste Erinnerung mit ${who}?`}>
            <p className="sublabel">
              Ein gemeinsamer Moment, der euch verbindet — je konkreter, desto
              schöner wird der Song.
            </p>
            <textarea
              className="fld"
              rows={5}
              placeholder={`z. B. „Als wir zusammen im Regen am Meer standen und einfach gelacht haben …"`}
              value={a.story_memory}
              onChange={(e) => set("story_memory", e.target.value)}
              autoFocus
            />
            <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              {a.story_memory.trim().length < 10
                ? "Bitte schreib ein paar Worte (mind. 10 Zeichen)."
                : `${a.story_memory.trim().length} Zeichen — wunderbar 💜`}
            </p>
          </Step>
        )}

        {/* STEP 6 — Eigenschaften */}
        {step === 6 && (
          <Step title={`Was macht ${who} besonders?`}>
            <p className="sublabel">
              Eigenschaften, kleine Macken, was du an {who} liebst. (optional, aber
              macht den Song persönlicher)
            </p>
            <textarea
              className="fld"
              rows={5}
              placeholder={`z. B. „${who} ist die herzlichste Person, die ich kenne, lacht über ihre eigenen Witze und hat immer ein offenes Ohr …"`}
              value={a.story_traits}
              onChange={(e) => set("story_traits", e.target.value)}
              autoFocus
            />
          </Step>
        )}

        {/* STEP 7 — Insider + Absender */}
        {step === 7 && (
          <Step title="Insider, Spitznamen, gemeinsame Dinge?">
            <p className="sublabel">
              Spitznamen, ein Insider-Witz, euer Lieblingsort oder -lied … (optional)
            </p>
            <textarea
              className="fld"
              rows={4}
              placeholder={`z. B. „Ich nenne sie Spatz, wir lieben unseren Sonntags-Kaffee und sagen immer ‚alles wird gut'…"`}
              value={a.story_inside}
              onChange={(e) => set("story_inside", e.target.value)}
              autoFocus
            />
            <input
              className="fld"
              style={{ marginTop: 16 }}
              placeholder="Dein Name (optional — von wem ist der Song?)"
              value={a.sender_name}
              onChange={(e) => set("sender_name", e.target.value)}
            />
          </Step>
        )}

        {/* STEP 8 — Botschaft */}
        {step === 8 && (
          <Step title={`Was soll der Song ${who} sagen?`}>
            <p className="sublabel">
              Die Kern-Botschaft — das, was im Refrain ankommen soll. (optional)
            </p>
            <textarea
              className="fld"
              rows={4}
              placeholder={`z. B. „Danke, dass du immer für mich da bist — ich hab dich unendlich lieb."`}
              value={a.story_message}
              onChange={(e) => set("story_message", e.target.value)}
              autoFocus
            />
          </Step>
        )}

        {/* STEP 9 — Paket */}
        {step === 9 && (
          <Step title="Wähle dein Paket">
            <div style={{ display: "grid", gap: 14 }}>
              {(Object.keys(PACKAGES) as PackageId[]).map((id) => {
                const p = PACKAGES[id];
                const active = pkg === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPkg(id)}
                    style={{
                      textAlign: "left",
                      cursor: "pointer",
                      padding: "20px 22px",
                      borderRadius: 16,
                      border: active
                        ? "2px solid var(--accent-2)"
                        : "1px solid var(--line)",
                      background: active
                        ? "rgba(200,155,240,0.10)"
                        : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{ fontSize: 19, fontWeight: 600, fontFamily: "var(--serif)" }}
                      >
                        {p.name}
                        {id === "premium" && (
                          <span
                            style={{
                              fontSize: 11,
                              marginLeft: 10,
                              padding: "3px 9px",
                              borderRadius: 999,
                              background: "var(--gradient)",
                              color: "#1a0f24",
                              fontFamily: "var(--sans)",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                            }}
                          >
                            BELIEBT
                          </span>
                        )}
                      </span>
                      <span style={{ textAlign: "right" }}>
                        {p.compareAtCents && (
                          <span
                            className="muted"
                            style={{
                              textDecoration: "line-through",
                              fontSize: 14,
                              marginRight: 8,
                            }}
                          >
                            {formatPrice(p.compareAtCents)}
                          </span>
                        )}
                        <span style={{ fontSize: 22, fontWeight: 700 }}>
                          {formatPrice(p.priceCents)}
                        </span>
                      </span>
                    </div>
                    <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                      {p.features.map((f, i) => (
                        <li
                          key={i}
                          className="muted"
                          style={{ fontSize: 14, padding: "2px 0" }}
                        >
                          ✓ {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {/* STEP 10 — E-Mail + Checkout */}
        {step === EMAIL_STEP && (
          <Step title="Wohin dürfen wir den Song schicken?">
            <p className="sublabel">
              Du bekommst die fertige MP3 in wenigen Minuten an diese Adresse.
            </p>
            <input
              className="fld"
              type="email"
              placeholder="deine@email.de"
              value={a.email}
              onChange={(e) => set("email", e.target.value)}
              autoFocus
            />
            <div
              style={{
                marginTop: 18,
                padding: "16px 18px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="muted" style={{ fontSize: 15 }}>
                {PACKAGES[pkg].name} · Song für {a.recipient_name || "…"}
              </span>
              <strong style={{ fontSize: 18 }}>
                {formatPrice(PACKAGES[pkg].priceCents)}
              </strong>
            </div>
            {error && (
              <p style={{ color: "#ff9aa8", fontSize: 14, marginTop: 12 }}>{error}</p>
            )}
          </Step>
        )}

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          {step > 0 && (
            <button className="btn btn-ghost" onClick={back} disabled={loading}>
              Zurück
            </button>
          )}
          {step < EMAIL_STEP && (
            <button
              className="btn btn-primary"
              style={{ marginLeft: "auto" }}
              onClick={next}
              disabled={!canContinue()}
            >
              Weiter
            </button>
          )}
          {step === EMAIL_STEP && (
            <button
              className="btn btn-primary"
              style={{ marginLeft: "auto" }}
              onClick={startCheckout}
              disabled={!canContinue() || loading}
            >
              {loading
                ? "Einen Moment …"
                : `Jetzt für ${formatPrice(PACKAGES[pkg].priceCents)} bestellen`}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .fld {
          width: 100%;
          font-family: var(--sans);
          font-size: 16px;
          color: var(--text);
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 14px 16px;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .fld:focus {
          border-color: var(--accent-2);
          background: rgba(255,255,255,0.07);
        }
        .fld::placeholder { color: #7a6e92; }
        textarea.fld { resize: vertical; line-height: 1.6; }
        .sublabel {
          font-size: 14px;
          color: var(--muted);
          margin: 14px 0 10px;
        }
      `}</style>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: 26, marginBottom: 4 }}>{title}</h2>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

function ChoiceGrid({
  choices,
  value,
  onPick,
  cols = 2,
}: {
  choices: Choice[];
  value: string;
  onPick: (id: string) => void;
  cols?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 10,
      }}
    >
      {choices.map((c) => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            style={{
              cursor: "pointer",
              textAlign: "left",
              padding: "14px 14px",
              borderRadius: 13,
              border: active
                ? "2px solid var(--accent-2)"
                : "1px solid var(--line)",
              background: active ? "rgba(200,155,240,0.12)" : "rgba(255,255,255,0.03)",
              color: "var(--text)",
              transition: "all 0.13s ease",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>
              {c.emoji ? c.emoji + " " : ""}
              {c.label}
            </span>
            {c.hint && (
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.hint}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
