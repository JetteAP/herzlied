import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function SuccessPage() {
  return (
    <main
      className="container"
      style={{
        minHeight: "82vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        maxWidth: 620,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          border: "1px solid var(--line-strong)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 26,
          color: "var(--accent)",
          fontFamily: "var(--serif)",
          fontSize: 24,
          fontStyle: "italic",
        }}
      >
        ♪
      </div>
      <p className="eyebrow">Bezahlung erfolgreich</p>
      <h1 style={{ fontSize: "clamp(30px, 6vw, 46px)", margin: "18px 0 0" }}>
        Dein Song wird gerade <span className="gradient-text">komponiert</span>
      </h1>
      <p className="muted" style={{ fontSize: 18, marginTop: 22, lineHeight: 1.7 }}>
        Vielen Dank. Wir schreiben und vertonen deinen persönlichen Song gerade.
        In den nächsten Minuten landet die fertige Audiodatei automatisch in
        deinem E-Mail-Postfach.
      </p>
      <p className="muted" style={{ fontSize: 15, marginTop: 16 }}>
        Schau bei Bedarf auch im Spam-Ordner nach. Fragen beantworten wir gern
        unter{" "}
        <a href={`mailto:${BRAND.supportEmail}`} style={{ color: "var(--accent)" }}>
          {BRAND.supportEmail}
        </a>
        .
      </p>
      <Link href="/" className="btn btn-ghost" style={{ marginTop: 32 }}>
        Zur Startseite
      </Link>
    </main>
  );
}
