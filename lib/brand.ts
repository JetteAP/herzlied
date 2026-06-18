/**
 * Zentrale Marken-Konfiguration.
 * Hier kannst du Name, Domain, Slogan, Support-Mail etc. an EINER Stelle ändern.
 */
export const BRAND = {
  name: "A Song Made",
  // Erscheint im Browser-Tab und in E-Mails
  tagline: "Ein persönlicher Song als Geschenk — für den Menschen, den du liebst.",
  domain: "asongmade.com",
  supportEmail: "hallo@asongmade.com",
  // Wird im Stripe-Webhook genutzt, um FREMDE Events (anderer Projekte am
  // selben Stripe-Konto) zu ignorieren. NICHT ändern, nachdem Bestellungen laufen.
  orderNamespace: "asongmade",
} as const;
