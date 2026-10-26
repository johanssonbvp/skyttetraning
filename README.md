# 🎯 Petanque Träning

> **Gratis träningsapp för petanquespelare.** Träna, logga och följ din utveckling, på mobilen eller datorn.

![PWA](https://img.shields.io/badge/PWA-Ready-green?style=flat-square) ![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?style=flat-square) ![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)

**🌐 Webbplats:** [petanquetraning.se](https://petanquetraning.se)
**📖 Ny här?** Läs [lathunden](https://petanquetraning.se/lathund.html) eller [vanliga frågor](https://petanquetraning.se/faq.html).

---

## Vad appen kan

| Del | Fil | Vad den gör |
|---|---|---|
| 🔥 **Uppvärmning** | `uppvarmning.html` | Guidad rutin på cirka 9 minuter med timer |
| 💥 **Skjutträning** | `skjuttraning.html` | Skjut på 6–12 m, logga träff, miss och carreau, effektivitetsindex per avstånd |
| 🟡 **Läggträning** | `laggtraning.html` | Sex övningstyper för läggning, med statistik och rekord |
| 🎯 **Precisionsskytte** | `precisionsskytte.html` | 20 skott på 5 stationer enligt förbundets regler, upp till 100 poäng |
| 🔢 **Poängräknare** | `tavlingssimulator.html` | Poäng i singel, dubbel och trippel, med ångra-knapp |
| 📊 **Matchstatistik** | `matchstatistik.html` | Live-loggning av varje klot under lagmatcher, med statistik efteråt |
| 📔 **Träningsdagbok** | `dagbok.html` | Datum, plats, känsla, anteckningar, kalender och foton |

Dessutom: **startsida** (`index.html`), **lathund** (`lathund.html`), **vanliga frågor** (`faq.html`) och **integritetspolicy** (`integritetspolicy.html`).

---

## Konto, data och synk

- **Inloggning krävs** (e-post och lösenord, via Firebase Authentication).
- **Lokalt först.** Allt sparas på enheten och skickas sedan till Firebase Realtime Database. Därför fungerar appen **offline** efter inloggning, och det som sparats offline skickas automatiskt när nätet är tillbaka.
- **Flera enheter.** Telefonen och molnet slås ihop per post, så inget tappas mellan enheter. Raderingar och "Rensa allt" följer med.
- **Utloggning.** Appen skickar först upp allt, rensar sedan telefonen, och varnar om något inte hann sparas.
- **Foton i dagboken** sparas bara på enheten, inte i molnet.
- Synken ligger i `sync-manager.js`, inloggningskontrollen i `auth-gate.js`.

### Databasregler
Förslag och instruktioner för Firebase-reglerna finns i [`regler/`](regler/LASMIG.md).

---

## Språk

Svenska, engelska och franska. **Tyska är på väg** och dolt tills alla sidor är översatta.
- Språket väljs i rullgardinsmenyn på startsidan (och på vanliga frågor) och gäller i hela appen.
- Valet sparas på kontot och följer med till en ny telefon.
- Allt språk hanteras av `lang-manager.js`. Texter på sidorna skrivs med `data-sv`, `data-en`, `data-fr` och `data-de`.

---

## Teknik

| Del | Teknik |
|---|---|
| Frontend | HTML5, CSS3, vanlig JavaScript (inget ramverk) |
| Offline och installation | Service Worker (`sw.js`) och `manifest.json` (PWA) |
| Konto och databas | Firebase Authentication och Realtime Database |
| Push-notiser | OneSignal |
| Statistik | Google Analytics |
| Hosting | GitHub Pages |

### Filstruktur
```
index.html               Startsida (språkmeny, inloggning, övningskort)
uppvarmning.html  skjuttraning.html  laggtraning.html  precisionsskytte.html
tavlingssimulator.html   matchstatistik.html  dagbok.html
lathund.html  faq.html  integritetspolicy.html
lang-manager.js          Gemensamt språksystem
sync-manager.js          Synk mot Firebase (lokalt först, sammanslagning, offline)
auth-gate.js             Kräver inloggning på träningssidorna
storage-manager.js  offline-indicator.js
sw.js  manifest.json     Offline och installation
regler/                  Förslag på Firebase-regler
dokumentation/           Interna anteckningar
js/                      Google Analytics-spårning
serie/                   Gammal serie-sida, används inte längre
```

---

## Köra lokalt

```bash
git clone https://github.com/johanssonbvp/skyttetraning.git
cd skyttetraning
python3 -m http.server 8000
# Öppna http://localhost:8000 i webbläsaren
```

På `localhost` hoppar `auth-gate.js` över inloggningskontrollen så att sidorna går att testa. Själva inloggningen fungerar normalt bara på den riktiga adressen.

### Att tänka på vid ändringar
- Nya texter ska ha `data-sv`, `data-en`, `data-fr` och `data-de`.
- `sw.js` byter cache automatiskt per datum. Avinstallera och installera om appen på mobilen för att se en ny version direkt.
- Testa alltid lokalt innan du pushar. Sidan uppdateras på GitHub Pages inom en eller två minuter.

---

## Kontakt

- **Utvecklare:** Pär Johansson
- **E-post:** info@petanquetraning.se
- **GitHub:** [johanssonbvp/skyttetraning](https://github.com/johanssonbvp/skyttetraning)

---

## Licens

**Proprietär.** Copyright © 2026 Pär Johansson. Alla rättigheter förbehållna. Appen är gratis att använda, men koden får inte kopieras, ändras eller distribueras utan tillstånd. Se [LICENSE](LICENSE).
