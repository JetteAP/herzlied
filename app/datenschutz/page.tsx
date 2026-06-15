import Link from "next/link";

export default function Datenschutz() {
  return (
    <main className="container" style={{ maxWidth: 720, padding: "60px 22px" }}>
      <Link href="/" className="muted" style={{ fontSize: 14 }}>← Zurück</Link>
      <h1 style={{ fontSize: 34, margin: "18px 0 24px" }}>Datenschutzerklärung</h1>
      <div className="muted" style={{ fontSize: 16, lineHeight: 1.8 }}>
        <p style={{ color: "#ffd9a0", marginBottom: 18 }}>
          ⚠️ PLATZHALTER — bitte rechtlich prüfen lassen (z. B. mit einem
          Datenschutz-Generator) und an deine tatsächlichen Dienste anpassen.
        </p>
        <p>
          Wir nehmen den Schutz deiner persönlichen Daten ernst. Nachfolgend
          informieren wir dich über die Verarbeitung im Rahmen dieses Angebots.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>
          Welche Daten wir verarbeiten
        </h3>
        <p>
          Zur Erstellung und Lieferung deines Songs verarbeiten wir die von dir
          eingegebenen Angaben (Name des Beschenkten, Anlass, deine Geschichte,
          Stil) sowie deine E-Mail-Adresse.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>
          Eingesetzte Dienste (Auftragsverarbeiter)
        </h3>
        <ul style={{ paddingLeft: 20 }}>
          <li>Zahlungsabwicklung: Stripe Payments Europe, Ltd.</li>
          <li>Song-/Texterstellung (KI): ElevenLabs, OpenAI</li>
          <li>E-Mail-Versand: [z. B. Brevo / Sendinblue GmbH]</li>
          <li>Hosting: [z. B. Vercel Inc.]</li>
        </ul>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>
          Rechtsgrundlage & Speicherdauer
        </h3>
        <p>
          Die Verarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b
          DSGVO). Deine Daten werden nur so lange gespeichert, wie es zur
          Lieferung und für gesetzliche Aufbewahrungspflichten erforderlich ist.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>
          Deine Rechte
        </h3>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung, Datenübertragbarkeit und Widerspruch. Wende dich dazu
          an die im Impressum genannte Adresse.
        </p>
      </div>
    </main>
  );
}
