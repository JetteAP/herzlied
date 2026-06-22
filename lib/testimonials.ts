export type Testimonial = { quote: string; name: string };

// Hinweis: aktuell erfundene Beispiel-Bewertungen. Sobald echte Kundenstimmen
// vorliegen, hier ersetzen (in Deutschland sind erfundene Bewertungen rechtlich
// heikel, siehe UWG).
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Meine Mama hat geweint, als sie ihren Song gehört hat. So ein persönliches Geschenk hätte ich ihr nie zugetraut.",
    name: "Lena K., 27",
  },
  {
    quote:
      "Ich war erst skeptisch, aber der Song hat wirklich unsere Geschichte erzählt. Mein Mann war völlig sprachlos.",
    name: "Sarah M., 34",
  },
  {
    quote:
      "In wenigen Minuten ein Lied, das meine Oma zu Tränen gerührt hat. Absolut empfehlenswert.",
    name: "Julia mit Oma Inge",
  },
  {
    quote:
      "Das emotionalste Geschenk, das ich je gemacht habe. Ganz sicher nicht das letzte.",
    name: "Nina B., 29",
  },
  {
    quote:
      "Zum Muttertag verschenkt und voll ins Schwarze getroffen. Die Qualität hat mich umgehauen.",
    name: "Thomas R., 41",
  },
];
