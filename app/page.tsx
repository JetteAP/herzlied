import Link from "next/link";
import SongFunnel from "./components/SongFunnel";
import { BRAND } from "@/lib/brand";

export default function Home() {
  return (
    <main>
      {/* ---------------- HERO ---------------- */}
      <section className="container" style={{ paddingTop: 70, paddingBottom: 20, textAlign: "center" }}>
        <p className="eyebrow">{BRAND.name}</p>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 58px)", margin: "18px auto 0", maxWidth: 760 }}>
          Ein <span className="gradient-text">persönlicher Song</span> als
          Geschenk — aus deiner Geschichte
        </h1>
        <p
          className="muted"
          style={{ fontSize: 19, maxWidth: 600, margin: "22px auto 0", lineHeight: 1.6 }}
        >
          Beantworte ein paar Fragen über den Menschen, den du liebst. Wir
          verwandeln deine Worte in einen echten, gesungenen Song — fertig als
          MP3 in wenigen Minuten in deinem Postfach.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <a href="#funnel" className="btn btn-primary">
            Song erstellen 🎵
          </a>
        </div>
        <p className="muted" style={{ fontSize: 14, marginTop: 18 }}>
          ⭐️⭐️⭐️⭐️⭐️ &nbsp;Über 1.000 verschenkte Songs · Lieferung per E-Mail
        </p>
      </section>

      {/* ---------------- SO FUNKTIONIERT'S ---------------- */}
      <section className="container" style={{ padding: "50px 22px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {[
            { n: "1", t: "Erzähl deine Geschichte", d: "Wer wird beschenkt, zu welchem Anlass, welcher Stil — und das Besondere an dieser Person." },
            { n: "2", t: "Wir komponieren", d: "Aus deinen Worten entsteht ein individueller Songtext und eine echte, gesungene Aufnahme." },
            { n: "3", t: "Fertig in Minuten", d: "Du bekommst die MP3 per E-Mail — zum Vorspielen, Verschenken und Behalten." },
          ].map((s) => (
            <div key={s.n} className="card" style={{ padding: "26px 24px" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  background: "var(--gradient)",
                  color: "#1a0f24",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>{s.t}</h3>
              <p className="muted" style={{ fontSize: 15 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FUNNEL ---------------- */}
      <section id="funnel" className="container" style={{ padding: "30px 22px 60px", maxWidth: 640 }}>
        <h2 style={{ fontSize: 30, textAlign: "center", marginBottom: 26 }}>
          Erstelle jetzt deinen Song
        </h2>
        <SongFunnel />
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="container" style={{ padding: "20px 22px 70px", maxWidth: 700 }}>
        <h2 style={{ fontSize: 28, textAlign: "center", marginBottom: 24 }}>
          Häufige Fragen
        </h2>
        {[
          { q: "Wie lange dauert es?", a: "In der Regel wenige Minuten. Du bekommst den fertigen Song automatisch per E-Mail." },
          { q: "Ist das ein echter, gesungener Song?", a: "Ja — mit echtem Gesang, Instrumenten und Refrain, basierend auf deiner Geschichte. Du erhältst eine MP3-Datei." },
          { q: "Darf ich den Song verschenken / öffentlich abspielen?", a: "Ja, der Song ist für deinen privaten Gebrauch und zum Verschenken bestimmt." },
          { q: "Was, wenn mir der Song nicht gefällt?", a: `Schreib uns einfach an ${BRAND.supportEmail} — wir finden eine Lösung.` },
        ].map((f, i) => (
          <details
            key={i}
            className="card"
            style={{ padding: "18px 22px", marginBottom: 12 }}
          >
            <summary style={{ cursor: "pointer", fontSize: 17, fontWeight: 600 }}>
              {f.q}
            </summary>
            <p className="muted" style={{ fontSize: 15, marginTop: 10 }}>{f.a}</p>
          </details>
        ))}
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "30px 22px" }}>
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
          <span className="muted" style={{ fontSize: 14 }}>
            © {BRAND.name}
          </span>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <Link href="/impressum" className="muted" style={{ fontSize: 14 }}>
              Impressum
            </Link>
            <Link href="/datenschutz" className="muted" style={{ fontSize: 14 }}>
              Datenschutz
            </Link>
            <Link href="/agb" className="muted" style={{ fontSize: 14 }}>
              AGB
            </Link>
            <Link href="/widerruf" className="muted" style={{ fontSize: 14 }}>
              Widerruf
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
