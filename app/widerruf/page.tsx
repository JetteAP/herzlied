import Link from "next/link";

export default function Widerruf() {
  return (
    <main className="container" style={{ maxWidth: 720, padding: "60px 22px" }}>
      <Link href="/" className="muted" style={{ fontSize: 14 }}>← Zurück</Link>
      <h1 style={{ fontSize: 34, margin: "18px 0 24px" }}>Widerrufsbelehrung</h1>
      <div className="muted" style={{ fontSize: 16, lineHeight: 1.8 }}>
        <p style={{ color: "#ffd9a0", marginBottom: 18 }}>
          ⚠️ PLATZHALTER — bitte rechtlich prüfen lassen.
        </p>
        <p>
          Verbraucher haben grundsätzlich ein 14-tägiges Widerrufsrecht.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>
          Vorzeitiges Erlöschen bei digitalen Inhalten
        </h3>
        <p>
          Das Widerrufsrecht erlischt vorzeitig, wenn wir mit der Erstellung des
          individuellen Songs (digitaler Inhalt) auf deinen ausdrücklichen Wunsch
          hin beginnen und du bestätigt hast, dass du dadurch dein Widerrufsrecht
          verlierst. Da jeder Song individuell nach deinen Vorgaben angefertigt
          wird, handelt es sich zudem um eine Ware/Leistung nach
          Kundenspezifikation.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>Kontakt für Widerruf</h3>
        <p>
          Sende deinen Widerruf an die im Impressum genannte Adresse oder per
          E-Mail.
        </p>
      </div>
    </main>
  );
}
