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
- Språk: Svenska (SV), Engelska (EN), Spanska (ES)
- Språkväljare finns ENDAST på index.html
- Offline-läge ska alltid fungera

## Viktiga filer att känna till
- `lang-manager.js` – logik för språkbyte
- `sw.js` – Service Worker. Höj versionsnumret i filen vid ändringar, annars cachas den gamla versionen hos användarna!
- `index.html` – enda sidan med språkväljare
- Appfiler: `skjuttraning.html`, `laggtraning.html`, `dagbok.html`, `precisionsskytte.html`, `tavlingssimulator.html`, `matchstatistik.html`
- `storage-manager.js`, `sync-manager.js` – datalagring och synk

## Viktiga arbetsflöden
1. Höj versionsnumret i `sw.js` vid varje ändring → tvingar fram ny cache hos användarna
2. Lägg till `data-sv` / `data-en` / `data-es` på ALLA nya textelement
3. Testa lokalt innan ändringar laddas upp till GitHub
4. Avinstallera/installera om appen på mobilen för att se en ny version där

## Prioriteringar (i ordning)
1. Håll appen fungerande – inga trasiga filer!
2. Alla tre språk (SV/EN/ES) ska fungera överallt
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

**Språk (SV/EN/ES):**
- "Hitta alla textelement i [filnamn] som saknar `data-en` eller `data-es`, och lista dem åt mig. Ändra inget än."
- "Lägg till svenska, engelska och spanska översättningar för de textrader du precis listade, enligt samma mönster som i `laggtraning.html`."

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
