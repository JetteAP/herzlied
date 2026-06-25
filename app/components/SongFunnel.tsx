"use client";

import { useState } from "react";
import { PACKAGES, formatPrice, type PackageId } from "@/lib/packages";
import { TESTIMONIALS } from "@/lib/testimonials";

const FUNNEL_REVIEW_STEP = 4;

type Choice = { id: string; label: string; hint?: string };

const RELATIONSHIPS: Choice[] = [
  { id: "mutter", label: "Meine Mutter" },
  { id: "vater", label: "Mein Vater" },
  { id: "partnerin", label: "Meine Partnerin" },
  { id: "partner", label: "Mein Partner" },
  { id: "freundin", label: "Beste Freundin" },
  { id: "freund", label: "Bester Freund" },
  { id: "oma", label: "Meine Oma" },
  { id: "opa", label: "Mein Opa" },
  { id: "kind", label: "Mein Kind" },
  { id: "schwester", label: "Meine Schwester" },
  { id: "bruder", label: "Mein Bruder" },
  { id: "sonstiges", label: "Andere" },
];

const OCCASIONS: Choice[] = [
  { id: "geburtstag", label: "Geburtstag" },
  { id: "muttertag", label: "Muttertag" },
  { id: "vatertag", label: "Vatertag" },
  { id: "jahrestag", label: "Jahrestag" },
  { id: "hochzeit", label: "Hochzeit" },
  { id: "weihnachten", label: "Weihnachten" },
  { id: "valentinstag", label: "Valentinstag" },
  { id: "einfach_so", label: "Einfach so" },
  { id: "andere", label: "Anderer Anlass" },
];

const GENRES: Choice[] = [
  { id: "pop_ballade", label: "Pop-Ballade", hint: "Klavier, Streicher, große Gefühle" },
  { id: "akustik", label: "Akustik", hint: "Gitarre, intim, ehrlich" },
  { id: "folk_indie", label: "Indie-Folk", hint: "warm, handgemacht" },
  { id: "rock", label: "Modern Pop", hint: "tanzbar, mitreißend, fröhlich" },
  { id: "schlager", label: "Schlager", hint: "fröhlich, zum Mitsingen" },
  { id: "rnb_soul", label: "R&B / Soul", hint: "soulful, groovy" },
  { id: "hiphop", label: "Hip-Hop", hint: "Beat und gesungener Hook" },
  { id: "epic", label: "Episch", hint: "cineastisch, Gänsehaut" },
];

const MOODS: Choice[] = [
  { id: "emotional", label: "Emotional & berührend" },
  { id: "froehlich", label: "Fröhlich & beschwingt" },
  { id: "romantisch", label: "Romantisch" },
  { id: "kraftvoll", label: "Kraftvoll & motivierend" },
  { id: "nostalgisch", label: "Nostalgisch" },
  { id: "humorvoll", label: "Humorvoll & verspielt" },
];

const VOICES: Choice[] = [
  { id: "weiblich", label: "Weibliche Stimme" },
  { id: "maennlich", label: "Männliche Stimme" },
  { id: "egal", label: "Passend gewählt" },
];

const LANGUAGES: Choice[] = [
  { id: "de", label: "Deutsch" },
  { id: "en", label: "Englisch" },
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

const TOTAL_STEPS = 9;
const EMAIL_STEP = 8;

export default function SongFunnel() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [pkg, setPkg] = useState<PackageId>("basis");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof Answers, v: string) => setA((p) => ({ ...p, [k]: v }));

  const next = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const who = a.recipient_name.trim() || "die Person";

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
        return a.story_memory.trim().length >= 10;
      case 3:
        return a.genre.length > 0;
      case 4:
        return a.mood.length > 0;
      case 5:
        return true; // zweite Textfrage ist optional
      case 6:
        return a.voice.length > 0 && a.language.length > 0;
      case 7:
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
      <div style={{ height: 3, background: "rgba(60,44,38,0.06)" }}>
        <div
          style={{
            height: "100%",
            width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
            background: "var(--gradient)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ padding: "38px 34px 32px" }}>
        <p className="eyebrow" style={{ marginBottom: 20 }}>
          Schritt {step + 1} von {TOTAL_STEPS}
        </p>

        {/* STEP 0 — Empfänger */}
        {step === 0 && (
          <Step title="Für wen ist der Song?">
            <input
              className="fld"
              placeholder="Name des Beschenkten, etwa Mama oder Lena"
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
                placeholder="Wer ist diese Person? Etwa meine Patentante, mein Kollege"
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
                placeholder="Welcher Anlass? Etwa Schulabschluss, Einzug, Versöhnung"
                value={a.occasion_other}
                onChange={(e) => set("occasion_other", e.target.value)}
                autoFocus
              />
            )}
          </Step>
        )}

        {/* STEP 2 — Textfrage 1: Erinnerung */}
        {step === 2 && (
          <Step title={`Eure schönste Erinnerung mit ${who}`}>
            <p className="sublabel">
              Ein gemeinsamer Moment, der euch verbindet. Je konkreter, desto
              schöner wird der Song.
            </p>
            <textarea
              className="fld"
              rows={5}
              placeholder="Etwa: Als wir zusammen im Regen am Meer standen und einfach gelacht haben."
              value={a.story_memory}
              onChange={(e) => set("story_memory", e.target.value)}
              autoFocus
            />
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
              {a.story_memory.trim().length < 10
                ? "Bitte schreib ein paar Worte (mindestens 10 Zeichen)."
                : `${a.story_memory.trim().length} Zeichen, das genügt wunderbar.`}
            </p>
          </Step>
        )}

        {/* STEP 3 — Genre */}
        {step === 3 && (
          <Step title="Welcher Musikstil?">
            <ChoiceGrid
              choices={GENRES}
              value={a.genre}
              onPick={(v) => choose("genre", v)}
              cols={2}
            />
          </Step>
        )}

        {/* STEP 4 — Stimmung */}
        {step === 4 && (
          <Step title="Welche Stimmung soll der Song haben?">
            <ChoiceGrid
              choices={MOODS}
              value={a.mood}
              onPick={(v) => choose("mood", v)}
              cols={2}
            />
          </Step>
        )}

        {/* STEP 5 — Textfrage 2: Eigenschaften + Absender */}
        {step === 5 && (
          <Step title={`Was macht ${who} besonders?`}>
            <p className="sublabel">
              Eigenschaften, kleine Macken, Spitznamen, was du an {who} liebst.
              Optional, aber es macht den Song persönlicher.
            </p>
            <textarea
              className="fld"
              rows={5}
              placeholder={`Etwa: ${who} ist die herzlichste Person, die ich kenne, lacht über die eigenen Witze und nennt mich immer Spatz.`}
              value={a.story_traits}
              onChange={(e) => set("story_traits", e.target.value)}
              autoFocus
            />
            <input
              className="fld"
              style={{ marginTop: 16 }}
              placeholder="Dein Name (optional, von wem ist der Song?)"
              value={a.sender_name}
              onChange={(e) => set("sender_name", e.target.value)}
            />
          </Step>
        )}

        {/* STEP 6 — Stimme + Sprache */}
        {step === 6 && (
          <Step title="Stimme und Sprache">
            <p className="sublabel">Gesangsstimme</p>
            <ChoiceGrid
              choices={VOICES}
              value={a.voice}
              onPick={(v) => set("voice", v)}
              cols={3}
            />
            <p className="sublabel" style={{ marginTop: 24 }}>
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

        {/* STEP 7 — Paket */}
        {step === 7 && (
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
                      padding: "22px 24px",
                      borderRadius: 16,
                      border: active
                        ? "1px solid var(--accent)"
                        : "1px solid var(--line)",
                      background: active ? "var(--accent-soft)" : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{ fontSize: 20, fontWeight: 400, fontFamily: "var(--serif)" }}
                      >
                        {p.name}
                        {id === "premium" && (
                          <span
                            style={{
                              fontSize: 10,
                              marginLeft: 10,
                              padding: "3px 10px",
                              borderRadius: 999,
                              border: "1px solid var(--accent)",
                              color: "var(--accent)",
                              fontFamily: "var(--sans)",
                              fontWeight: 500,
                              letterSpacing: "0.12em",
                              verticalAlign: "middle",
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
                        <span style={{ fontSize: 22, fontWeight: 500, fontFamily: "var(--serif)" }}>
                          {formatPrice(p.priceCents)}
                        </span>
                      </span>
                    </div>
                    <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none" }}>
                      {p.features.map((f, i) => (
                        <li
                          key={i}
                          className="muted"
                          style={{ fontSize: 14.5, padding: "3px 0", paddingLeft: 18, position: "relative" }}
                        >
                          <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>·</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {/* STEP 8 — E-Mail + Checkout */}
        {step === EMAIL_STEP && (
          <Step title="Wohin dürfen wir den Song schicken?">
            <p className="sublabel">
              Du erhältst den fertigen Song in wenigen Minuten an diese Adresse.
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
                marginTop: 20,
                padding: "20px 22px",
                borderRadius: 14,
                background: "var(--accent-soft)",
                border: "1px solid var(--line)",
                textAlign: "center",
              }}
            >
              <p style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--text)", margin: 0 }}>
                Nur noch ein Schritt bis zu deinem Song
              </p>
              <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
                Sichere Bezahlung · Lieferung in wenigen Minuten
              </p>
            </div>
            {error && (
              <p style={{ color: "#b4524a", fontSize: 14, marginTop: 12 }}>{error}</p>
            )}
          </Step>
        )}

        {/* Bewertung mittig im Funnel */}
        {step === FUNNEL_REVIEW_STEP && (
          <div
            style={{
              marginTop: 26,
              padding: "18px 20px",
              borderRadius: 14,
              background: "var(--accent-soft)",
              border: "1px solid var(--line)",
            }}
          >
            <div style={{ color: "var(--accent)", letterSpacing: "0.12em", fontSize: 13, marginBottom: 8 }}>
              ★★★★★
            </div>
            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: 15.5,
                fontStyle: "italic",
                lineHeight: 1.5,
                color: "var(--text)",
                margin: 0,
              }}
            >
              „{TESTIMONIALS[3].quote}"
            </p>
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
              {TESTIMONIALS[3].name}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 30,
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
                ? "Einen Moment"
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
          background: rgba(60,44,38,0.04);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 15px 17px;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .fld:focus {
          border-color: var(--accent);
          background: rgba(60,44,38,0.06);
        }
        .fld::placeholder { color: #a89a8d; }
        textarea.fld { resize: vertical; line-height: 1.6; }
        .sublabel {
          font-size: 14.5px;
          color: var(--muted);
          margin: 16px 0 12px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: 27, marginBottom: 4, lineHeight: 1.2 }}>{title}</h2>
      <div style={{ marginTop: 18 }}>{children}</div>
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
              padding: "15px 16px",
              borderRadius: 13,
              border: active
                ? "1px solid var(--accent)"
                : "1px solid var(--line)",
              background: active ? "var(--accent-soft)" : "rgba(60,44,38,0.02)",
              color: "var(--text)",
              transition: "all 0.13s ease",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 500 }}>{c.label}</span>
            {c.hint && (
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.hint}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
