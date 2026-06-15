/**
 * Zentrale Marken-Konfiguration.
 * Hier kannst du Name, Domain, Slogan, Support-Mail etc. an EINER Stelle ändern.
 */
export const BRAND = {
  name: "Herzlied",
  // Erscheint im Browser-Tab und in E-Mails
  tagline: "Ein persönlicher Song als Geschenk — in Minuten erstellt.",
  domain: "herzlied.de",
  supportEmail: "hallo@herzlied.de",
  // Wird im Stripe-Webhook genutzt, um FREMDE Events (anderer Projekte am
  // selben Stripe-Konto) zu ignorieren. NICHT ändern, nachdem Bestellungen laufen.
  orderNamespace: "herzlied",
} as const;
