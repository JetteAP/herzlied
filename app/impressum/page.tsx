import Link from "next/link";

export default function Impressum() {
  return (
    <main className="container" style={{ maxWidth: 720, padding: "60px 22px" }}>
      <Link href="/" className="muted" style={{ fontSize: 14 }}>← Zurück</Link>
      <h1 style={{ fontSize: 34, margin: "18px 0 24px" }}>Impressum</h1>
      <div className="muted" style={{ fontSize: 16, lineHeight: 1.8 }}>
        <p style={{ color: "#ffd9a0", marginBottom: 18 }}>
          ⚠️ PLATZHALTER — bitte vor dem Livegang mit deinen echten Daten ersetzen.
        </p>
        <p><strong>Angaben gemäß § 5 TMG / § 5 DDG</strong></p>
        <p style={{ marginTop: 12 }}>
          [Dein Name / Firmenname]<br />
          [Straße und Hausnummer]<br />
          [PLZ und Ort]<br />
          [Land]
        </p>
        <p style={{ marginTop: 16 }}>
          <strong>Kontakt</strong><br />
          E-Mail: [deine@email.de]<br />
          Telefon: [optional]
        </p>
        <p style={{ marginTop: 16 }}>
          <strong>Umsatzsteuer-ID</strong> (falls vorhanden): [DE…]
        </p>
        <p style={{ marginTop: 16 }}>
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: [Name, Anschrift]
        </p>
      </div>
    </main>
  );
}
