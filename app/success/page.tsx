import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function SuccessPage() {
  return (
    <main
      className="container"
      style={{
        minHeight: "80vh",
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
          width: 72,
          height: 72,
          borderRadius: 999,
          background: "var(--gradient)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          marginBottom: 24,
        }}
      >
        🎵
      </div>
      <p className="eyebrow">Bezahlung erfolgreich</p>
      <h1 style={{ fontSize: "clamp(30px, 6vw, 46px)", margin: "16px 0 0" }}>
        Dein Song wird gerade <span className="gradient-text">komponiert</span>
      </h1>
      <p className="muted" style={{ fontSize: 18, marginTop: 20, lineHeight: 1.6 }}>
        Vielen Dank! Wir schreiben und vertonen deinen ganz persönlichen Song
        gerade. In den nächsten Minuten landet die fertige MP3 automatisch in
        deinem E-Mail-Postfach.
      </p>
      <p className="muted" style={{ fontSize: 15, marginTop: 16 }}>
        Schau auch im Spam-Ordner nach, falls du nichts findest. Fragen?
        Schreib uns an{" "}
        <a href={`mailto:${BRAND.supportEmail}`} style={{ color: "var(--accent)" }}>
          {BRAND.supportEmail}
        </a>
        .
      </p>
      <Link href="/" className="btn btn-ghost" style={{ marginTop: 30 }}>
        Zur Startseite
      </Link>
    </main>
  );
}
