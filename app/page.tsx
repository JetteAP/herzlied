import Link from "next/link";
import SongFunnel from "./components/SongFunnel";
import { BRAND } from "@/lib/brand";

export default function Home() {
  return (
    <main>
      {/* ---------------- HERO ---------------- */}
      <section className="container" style={{ paddingTop: 84, paddingBottom: 24, textAlign: "center" }}>
        <p className="eyebrow">{BRAND.name}</p>
        <h1 style={{ fontSize: "clamp(34px, 5.2vw, 52px)", margin: "20px auto 0", maxWidth: 620 }}>
          Ein Song
          <br />
          der <span className="gradient-text">von Herzen</span> kommt
        </h1>
        <p
          className="muted"
          style={{ fontSize: 18, maxWidth: 520, margin: "22px auto 0", lineHeight: 1.65 }}
        >
          Erzähl uns von einem Menschen, den du liebst. Wir verwandeln deine
          Worte in einen echten, gesungenen Song.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 34, flexWrap: "wrap" }}>
          <a
            href="#funnel"
            className="btn btn-primary btn-glow"
            style={{ fontSize: 17, padding: "18px 42px" }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Song erstellen
          </a>
        </div>
        <p className="muted" style={{ fontSize: 14, marginTop: 22, letterSpacing: "0.02em" }}>
          <span style={{ color: "var(--accent)", letterSpacing: "0.15em" }}>★★★★★</span>
          &nbsp;&nbsp;Über 1.000 verschenkte Songs · Lieferung per E-Mail
        </p>
      </section>

      {/* ---------------- SO ENTSTEHT DEIN SONG ---------------- */}
      <section className="container" style={{ padding: "56px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 18,
          }}
        >
          {[
            { n: "I", t: "Erzähl deine Geschichte", d: "Wer wird beschenkt, zu welchem Anlass, in welchem Stil, und was diesen Menschen besonders macht." },
            { n: "II", t: "Wir komponieren", d: "Aus deinen Worten entsteht ein individueller Text und eine echte, gesungene Aufnahme." },
            { n: "III", t: "Fertig in Minuten", d: "Du erhältst den Song per E-Mail, zum Vorspielen, Verschenken und Behalten." },
          ].map((s) => (
            <div key={s.n} className="card" style={{ padding: "30px 28px" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  border: "1px solid var(--line-strong)",
                  color: "var(--accent)",
                  fontFamily: "var(--serif)",
                  fontSize: 16,
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: 21, marginBottom: 10 }}>{s.t}</h3>
              <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.65 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FUNNEL ---------------- */}
      <section id="funnel" className="container" style={{ padding: "32px 24px 64px", maxWidth: 660 }}>
        <p className="eyebrow" style={{ textAlign: "center" }}>In wenigen Minuten</p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 34px)", textAlign: "center", margin: "14px 0 30px" }}>
          Erstelle deinen Song
        </h2>
        <SongFunnel />
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="container" style={{ padding: "24px 24px 80px", maxWidth: 720 }}>
        <h2 style={{ fontSize: 28, textAlign: "center", marginBottom: 28 }}>
          Häufige Fragen
        </h2>
        {[
          { q: "Wie lange dauert es?", a: "In der Regel nur wenige Minuten. Du erhältst den fertigen Song automatisch per E-Mail." },
          { q: "Ist das ein echter, gesungener Song?", a: "Ja. Mit echtem Gesang, Instrumenten und Refrain, geschrieben allein aus deiner Geschichte. Du bekommst eine Audiodatei zum Herunterladen." },
          { q: "Darf ich den Song verschenken und abspielen?", a: "Ja, der Song ist für deinen privaten Gebrauch und zum Verschenken bestimmt." },
          { q: "Was, wenn mir der Song nicht gefällt?", a: `Schreib uns einfach an ${BRAND.supportEmail}, wir finden eine Lösung.` },
        ].map((f, i) => (
          <details
            key={i}
            className="card"
            style={{ padding: "20px 24px", marginBottom: 12 }}
          >
            <summary style={{ cursor: "pointer", fontSize: 17, fontWeight: 500, fontFamily: "var(--serif)" }}>
              {f.q}
            </summary>
            <p className="muted" style={{ fontSize: 15.5, marginTop: 12, lineHeight: 1.65 }}>{f.a}</p>
          </details>
        ))}
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 24px" }}>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <span className="muted" style={{ fontSize: 14, fontFamily: "var(--serif)", letterSpacing: "0.04em" }}>
            {BRAND.name}
          </span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/impressum" className="muted" style={{ fontSize: 13.5 }}>Impressum</Link>
            <Link href="/datenschutz" className="muted" style={{ fontSize: 13.5 }}>Datenschutz</Link>
            <Link href="/agb" className="muted" style={{ fontSize: 13.5 }}>AGB</Link>
            <Link href="/widerruf" className="muted" style={{ fontSize: 13.5 }}>Widerruf</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
