export type PackageId = "basis" | "premium";

export type Package = {
  id: PackageId;
  name: string;
  priceCents: number;
  tagline: string;
  /** Songlänge in Millisekunden, die an ElevenLabs übergeben wird. */
  lengthMs: number;
  /** Wie viele Song-Varianten generiert + mitgeschickt werden. */
  variants: number;
  /** Zeigt im Funnel als durchgestrichener "Statt"-Preis. */
  compareAtCents?: number;
  features: string[];
};

export const PACKAGES: Record<PackageId, Package> = {
  basis: {
    id: "basis",
    name: "Basis",
    priceCents: 999,
    compareAtCents: 1999,
    tagline: "Dein persönlicher Song (ca. 1,5 Min) als MP3",
    lengthMs: 90_000,
    variants: 1,
    features: [
      "1 persönlicher Song (ca. 1,5 Minuten)",
      "Individuell auf deine Geschichte getextet",
      "Als MP3 zum Herunterladen & Verschenken",
      "Lieferung per E-Mail in wenigen Minuten",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    priceCents: 1999,
    compareAtCents: 2999,
    tagline: "Längerer Song (ca. 2,5 Min) + 2 Varianten zur Auswahl",
    lengthMs: 150_000,
    variants: 2,
    features: [
      "Längerer Song (ca. 2,5 Minuten)",
      "2 Varianten zur Auswahl (verschiedene Interpretationen)",
      "Individuell auf deine Geschichte getextet",
      "Als MP3 zum Herunterladen & Verschenken",
      "Lieferung per E-Mail in wenigen Minuten",
    ],
  },
};

export function isValidPackageId(id: string): id is PackageId {
  return id === "basis" || id === "premium";
}

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}
