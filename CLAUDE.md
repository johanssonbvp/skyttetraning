# Petanque Träning – instruktioner för Claude Code

## Om projektet
- App: petanquetraning.se (PWA för petanqueträning)
- Utvecklare: Pär Johansson – ensam utvecklare, programmeringsnovis som förlitar sig på Claude för teknisk implementation
- GitHub: https://github.com/johanssonbvp/skyttetraning
- Licens: PROPRIETARY (inte MIT)

## Teknikstack
- Frontend: HTML5, CSS3, Vanilla JavaScript (inget ramverk)
- PWA: Service Worker (sw.js) + manifest.json
- Backend: Firebase Realtime Database
- Hosting: GitHub Pages
- Push-notiser: OneSignal
- Analys: Google Analytics

## Nuvarande status
- Språk: Svenska (SV), Engelska (EN), Franska (FR) och Tyska (DE). Alla fyra är påslagna (listan `enabled` i `lang-manager.js`). Integritetspolicyn finns bara på svenska
- Språkväljare (rullgardinsmeny) finns på index.html, faq.html och lathund.html. Valet gäller hela appen och sparas på kontot
- Alla träningssidor kräver inloggning (`auth-gate.js`)
- Offline-läge ska alltid fungera

## Viktiga filer att känna till
- `lang-manager.js` – gemensamt språksystem för alla sidor (språk, texter, datumformat)
- `auth-gate.js` – kräver inloggning på träningssidorna
- `lathund.html` – lathund för nya användare, `faq.html` – vanliga frågor
- `sw.js` – Service Worker. Cache-namnet byts automatiskt per dag. Nya filer måste läggas till i listan `CORE_FILES`, annars fungerar de inte offline
- `index.html` – startsida med språkmeny och inloggning
- Appfiler: `skjuttraning.html`, `laggtraning.html`, `dagbok.html`, `precisionsskytte.html`, `tavlingssimulator.html`, `matchstatistik.html`
- `storage-manager.js`, `sync-manager.js` – datalagring och synk
- `icons.js` – gemensamma ikoner (Heroicons, outline, MIT-licens, text i `dokumentation/licenser.md`). Används som `<svg class="ico"><use href="#i-namn"/></svg>` i HTML och `ptIcon('namn')` i JavaScript

## Bra att veta om skjutträningens statistik (`skjuttraning.html`)
- Varje pass sparas med skottordning (`log`). Äldre pass saknar den och kan inte få den i efterhand
- Effektivitetsindexet räknar återhämtning och startskott först när det finns minst 5 pass med skottordning (`MIN_PASS_MED_ORDNING`). Tills dess neutrala 50 %
- Indexet kan filtreras per avstånd (`effFilter`). Med färre än 3 pass visas "–"
- Rekord, bästa och sämsta räknas från pass med minst 20 skott (`MIN_SKOTT_REKORD`), annars alla pass. Snittet vägs efter antal skott (`wAvg`)
- Resultatrutan efter ett fullt avstånd har "Klar för idag". Passet sparas redan när serien är full

## Bra att veta om läggträningens statistik (`laggtraning.html`)
- Statistiken räknas från historiken (`pt_lagg_history`), inget extra sparas. Funktionerna `renderLaggExtra`, `recoveryHtml`, `exDetailHtml`, `wPct`
- Procent räknas vägt efter antal kast (`wPct`). Bästa pass och rekord för precision/zon räknas från pass med minst 20 kast (`MIN_KAST_REKORD`), annars alla pass
- Avstånd och trend visas först efter 3 pass (`MIN_PASS_VISA`), annars "–"
- Återhämtning efter miss och första kastet bygger på `log` (kastordning). Visas först när minst 5 pass har den (`MIN_PASS_MED_ORDNING`), annars "Samlar data"

## Bra att veta om matchstatistiken (`matchstatistik.html`)
- Sidan har sin egen lagring (`coaches/<id>/matches` och `/players` i Firebase, plus localStorage) och använder inte `SYNC_KEYS`. Den loggar in med Firebase-kontot, så sökvägen är samma som kontots id
- Namn från användare läggs alltid i HTML via `esc()`. Använd den även för nya ställen, annars kan namn med ' eller " förstöra sidan
- Texter finns i `MS` och hämtas med `mt('nyckel')`. Nya texter ska finnas på sv/en/fr/de. Knappar och etiketter som byggs i JavaScript behöver `data-sv`/`data-en`/`data-fr`/`data-de`
- Resultat per match kommer från `match.score` och `matchResult()`. Matcher med 0-0 eller utan poäng räknas inte som vunna eller förlorade
- Omgångsanalysen (`renderRoundAnalysis`) bygger på `roundScores` och `roundActions`. Firebase kan lämna `null` i listor, så filtrera alltid
- Procent räknas vägt efter antal kast (`histPct`, `pctOfList`, `teamPct`), inte som medelvärde av matchernas procent
- Spelarvyn (`#player-stats-root`) flyttas mellan fliken SPELARE och startsidans statistikskärm (`openStatsScreen`/`closeStatsScreen`)
- En omgång utan poäng (lillen död) sparas som `roundScores[r] = { winner: 'none', points: 0 }`. "Hoppa över" sparar ingenting och betyder okänt resultat. Kod som läser `winner` måste hantera `'none'` (ändra inte ställningen)
- `buildRounds(m)` ger omgångarna med ställning före varje omgång. `complete` är false om en omgång (utom den sista) saknar resultat, och då hoppas matchen över i pressstatistiken (`buildPressStats`)
- Återhämtning efter miss räknas på kasten i ordning (`throwSequences`, `addRecovery`). Äldre matcher utan `roundActions` använder `timeline` (bara eget lag)
- Gränser innan siffror visas: `MIN_KAST_PRESS` (12), `MIN_KAST_REC` (10), `MIN_KAST_MOTST` (10). Under gränsen visas "Samlar data"
- Motståndarprofiler byggs av `buildOpponentProfiles()` (nyckel = namnet med små bokstäver, standardnamnet "Motståndare" hoppas över). Förslag på namn och sammanfattning före match: `refreshOpponentNames`, `updateOpponentHint`

## Viktiga arbetsflöden
1. Lägg nya filer i `CORE_FILES` i `sw.js` (cache-namnet byts automatiskt per dag, ingen manuell höjning behövs)
2. Lägg till `data-sv` / `data-en` / `data-fr` / `data-de` på ALLA nya textelement
3. Testa lokalt innan ändringar laddas upp till GitHub
4. Avinstallera/installera om appen på mobilen för att se en ny version där
5. Ikoner: använd Heroicons från `icons.js` i stället för emojis. Ny ikon = lägg den i listan i `icons.js` (hämta outline-versionen från heroicons.com). Lägg ikonen i ett eget element bredvid texten, aldrig inne i ett element med `data-sv`/`data-i18n`, annars tar språkbytet bort den. Behåll tecknen ✓ ✗ ✕ ★ på träffknappar och emojis i popup-rutor (`alert`/`confirm`), delningstexter och exporter
6. Ny funktion som sparar data = lägg nyckeln (t.ex. `pt_nyfunktion_v1`) i `SYNC_KEYS` i `sync-manager.js`. Annars synkas den inte till molnet (tidigare hamnade sådana nycklar lösa under kontot i Firebase)

## Prioriteringar (i ordning)
1. Håll appen fungerande – inga trasiga filer!
2. Alla språk (SV/EN/FR/DE) ska fungera överallt
3. Smidig PWA-installation
4. Offline-funktionen ska bevaras
5. Analysspårningen ska fungera

## Hur jag vill att du jobbar
- Jag är **programmeringsnovis** – undvik fackspråk, eller förklara det på enkel svenska direkt om du måste använda ett tekniskt begrepp
- **Fråga alltid innan du börjar koda eller ändra filer** – bekräfta att du förstått vad jag vill ha
- Ge alltid **flera alternativ** när det finns olika sätt att lösa något, inte bara ett
- Håll koden så **enkel och läsbar** som möjligt
- Skriv alltid kommentarer i koden på **svenska**
- Förklara i vanlig text vad koden gör efter varje kodblock
- Skriv beskrivande commit-meddelanden

## Säkerhet
- Exponera ALDRIG API-nycklar, Firebase-uppgifter eller adminlösenord i kod, commits eller svar

## Snabbguide – promptar att testa

**Förstå koden (riskfritt att börja med):**
- "Förklara vad `storage-manager.js` gör, steg för steg, utan att anta att jag kan JavaScript sen innan."
- "Gå igenom `sync-manager.js` och berätta i vanlig text vad den synkar och när."

**Språk (SV/EN/FR):**
- "Hitta alla textelement i [filnamn] som saknar `data-en` eller `data-fr`, och lista dem åt mig. Ändra inget än."
- "Lägg till svenska, engelska och franska översättningar för de textrader du precis listade, enligt samma mönster som i `laggtraning.html`."

**Buggar och underhåll:**
- "Jag får [beskriv felet] när jag gör X i appen. Hitta orsaken och föreslå en lösning innan du ändrar något."
- "Höj versionsnumret i `sw.js` och förklara med en mening varför det behövs efter dagens ändringar."

**Nya funktioner (låt Claude planera innan den kodar):**
- "Jag vill lägga till [funktion]. Föreslå ett upplägg i samma stil som [befintlig fil], men skriv ingen kod än." (använd Plan-läget)

**Städning/kvalitet:**
- "Jämför [fil A] och [fil B] och se om något känns inkonsekvent mellan dem."
- Skriv `/code-review` för att låta Claude granska det den just ändrat.

**Git/commit:**
- "Skriv ett beskrivande commit-meddelande på svenska för ändringarna vi gjort nu."
- "Skapa en pull request på GitHub med en kort sammanfattning av det vi ändrat."

## Smarta vanor i Claude Code
1. Börja i läget **Manual** – du godkänner varje ändring innan den sparas.
2. Använd **Plan**-läget för större idéer, så inget skrivs förrän du godkänt upplägget.
3. Skriv `@filnamn` (t.ex. `@sw.js`) för att dra in en specifik fil i konversationen.
4. Håll varje session till en sak i taget, hellre fem små uppgifter än en stor rörig.
5. Kör `git pull` innan du startar en ny session, så Claude jobbar mot senaste versionen.
6. Testa alltid lokalt i webbläsaren innan ändringar laddas upp till GitHub.
7. Bygg ut denna fil efter hand – upptäcker du att Claude gör samma miss två gånger, lägg till en rad om det här.
