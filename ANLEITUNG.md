# Herzlied — Anleitung (Schritt für Schritt)

Ein Funnel, der aus den Antworten des Besuchers automatisch einen **persönlichen
Song (MP3)** erzeugt und per E-Mail ausliefert.

**Ablauf:** Besucher beantwortet Fragen → bezahlt (Stripe) → ein Sprachmodell
schreibt die Songtexte (OpenAI, optional) → ElevenLabs komponiert den Song →
MP3 wird automatisch per E-Mail zugeschickt.

---

## 1. Lokal starten (zum Anschauen)

```bash
cd herzlied
npm install
cp .env.example .env.local      # danach .env.local mit deinen Keys ausfüllen
npm run dev
```

Dann im Browser: http://localhost:3000

> Zum reinen **Anschauen** des Designs brauchst du noch keine Keys. Für echte
> Bestellungen + Songgenerierung müssen die Keys in `.env.local` gesetzt sein.

---

## 2. Die benötigten Konten & Keys

Trage alle Werte in `.env.local` ein (Vorlage: `.env.example`).

### a) Stripe (Zahlungen) — Pflicht
1. Konto: https://dashboard.stripe.com
2. **API-Keys** → `STRIPE_SECRET_KEY` (mit `sk_test_…` zum Testen).
3. **Webhook einrichten** (Schritt 4 unten) → liefert `STRIPE_WEBHOOK_SECRET`.

### b) ElevenLabs (Song) — Pflicht
1. Konto: https://elevenlabs.io
2. **Wichtig:** Für den Verkauf brauchst du einen **bezahlten Plan** (ab
   „Starter"), der die **kommerzielle Lizenz** enthält.
3. API-Key: https://elevenlabs.io/app/settings/api-keys → `ELEVENLABS_API_KEY`.

### c) OpenAI (Songtexte) — empfohlen, optional
1. Konto: https://platform.openai.com
2. API-Key → `OPENAI_API_KEY`.
3. Ohne diesen Key schreibt ElevenLabs die Texte selbst (weniger persönlich).

### d) E-Mail-Versand (SMTP, z. B. Brevo) — Pflicht
1. Kostenloses Konto: https://www.brevo.com
2. **SMTP-Key:** https://app.brevo.com/settings/keys/smtp
3. Werte: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
4. Die Absender-Domain in `SMTP_FROM` solltest du in Brevo verifizieren, damit
   Mails nicht im Spam landen.

---

## 3. Live stellen (Vercel)

1. Code zu GitHub pushen (eigenes Repo).
2. Auf https://vercel.com → **New Project** → das Repo importieren.
3. Unter **Settings → Environment Variables** ALLE Werte aus `.env.local`
   eintragen (inkl. `NEXT_PUBLIC_BASE_URL` = deine echte Domain, z. B.
   `https://herzlied.de`).
4. Deploy. Eigene Domain unter **Settings → Domains** verbinden.

> Songgenerierung kann 1–3 Minuten dauern. Der Webhook ist auf `maxDuration = 300`
> (5 Min) gesetzt — dafür ist ein **Vercel-Pro-Plan** empfehlenswert (Hobby
> limitiert die Ausführungszeit stärker).

---

## 4. Stripe-Webhook einrichten (damit der Song automatisch erstellt wird)

Der Webhook ist das Herzstück: Nach jeder Zahlung ruft Stripe ihn auf, und der
Song wird erzeugt + verschickt.

1. Stripe-Dashboard → **Entwickler → Webhooks → Endpoint hinzufügen**.
2. Endpoint-URL: `https://DEINE-DOMAIN/api/webhook`
3. Event auswählen: **`checkout.session.completed`**
4. Nach dem Anlegen: **Signing secret** kopieren (`whsec_…`) →
   in `STRIPE_WEBHOOK_SECRET` eintragen (lokal in `.env.local`, live in Vercel).

**Lokal testen** mit der Stripe-CLI:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
# Das ausgegebene whsec_... in .env.local als STRIPE_WEBHOOK_SECRET eintragen.
```

---

## 5. Preise & Pakete ändern

Datei: `lib/packages.ts` — dort Preis (`priceCents`), Songlänge (`lengthMs`)
und Varianten (`variants`) anpassen.

## 6. Marke / Name / Domain ändern

Datei: `lib/brand.ts` — Name, Domain, Support-Mail an einer Stelle.

## 7. Fragen im Funnel ändern

Datei: `app/components/SongFunnel.tsx` (die Auswahlmöglichkeiten oben) und
`lib/songPrompt.ts` (wie die Auswahl in den Song-Prompt übersetzt wird).
**Wichtig:** Wenn du IDs änderst, an beiden Stellen gleich halten.

---

## 8. Kosten pro Song (grobe Orientierung)

- **ElevenLabs Music:** ca. 2.000 Credits/Minute. Je nach Plan grob
  **0,30–0,70 € pro Song**.
- **OpenAI (Songtext):** wenige Cent pro Song.
- **Brevo:** im Gratis-Tarif bis zu einer gewissen Mailmenge kostenlos.

Bei einem Verkaufspreis von 9,99 € bleibt also eine hohe Marge.

---

## 9. Vor dem echten Livegang nicht vergessen

- [ ] Impressum, Datenschutz, AGB, Widerruf mit echten Daten füllen
      (Dateien unter `app/impressum`, `app/datenschutz`, `app/agb`, `app/widerruf`).
- [ ] Stripe von **Test** auf **Live** umstellen (Live-Keys + Live-Webhook).
- [ ] Absender-Domain in Brevo verifizieren.
- [ ] Einen echten Testkauf machen und prüfen, ob die Mail mit MP3 ankommt.
