import Link from "next/link";

export default function AGB() {
  return (
    <main className="container" style={{ maxWidth: 720, padding: "60px 22px" }}>
      <Link href="/" className="muted" style={{ fontSize: 14 }}>← Zurück</Link>
      <h1 style={{ fontSize: 34, margin: "18px 0 24px" }}>
        Allgemeine Geschäftsbedingungen
      </h1>
      <div className="muted" style={{ fontSize: 16, lineHeight: 1.8 }}>
        <p style={{ color: "#ffd9a0", marginBottom: 18 }}>
          ⚠️ PLATZHALTER — bitte rechtlich prüfen lassen.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "12px 0 8px", fontSize: 20 }}>1. Leistung</h3>
        <p>
          Gegenstand ist die Erstellung eines individuellen, KI-generierten
          Songs (Audiodatei) auf Basis der vom Kunden gemachten Angaben sowie
          die Lieferung per E-Mail.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>2. Vertragsschluss & Preis</h3>
        <p>
          Der Vertrag kommt mit Abschluss der Bestellung und Zahlung zustande.
          Es gilt der jeweils im Bestellprozess angegebene Preis inkl. USt.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>3. Lieferung</h3>
        <p>
          Die Lieferung erfolgt digital an die angegebene E-Mail-Adresse, in der
          Regel innerhalb weniger Minuten nach Zahlungseingang.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>4. Nutzungsrechte</h3>
        <p>
          Der Kunde erhält den Song für private Zwecke und zum Verschenken.
        </p>
        <h3 style={{ color: "#f3ecff", margin: "22px 0 8px", fontSize: 20 }}>5. Widerruf</h3>
        <p>
          Es gilt die separate Widerrufsbelehrung. Bei digitalen Inhalten kann
          das Widerrufsrecht vorzeitig erlöschen (siehe Widerrufsbelehrung).
        </p>
      </div>
    </main>
  );
}
