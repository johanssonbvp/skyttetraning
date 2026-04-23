# ⚫ Petanque Träning

> **Gratis träningsplattform för petanquespelare** — Spåra ditt spel, förbättra dina färdigheter och konkurrera med vänner.

![Petanque Ball](https://img.shields.io/badge/Petanque-Träning-FFD700?style=flat-square) ![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?style=flat-square) ![PWA Ready](https://img.shields.io/badge/PWA-Ready-green?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-red?style=flat-square)

**🌐 Besök:** [petanquetraning.se](https://petanquetraning.se)

---

## 📱 Om projektet

**Petanque Träning** är en komplett webb- och PWA-baserad träningsplattform designad för petanquespelare i alla nivåer. Appen hjälper dig att:

✅ **Träna skjutning** — Registrera miss, träff och carreau med detaljerad statistik per avstånd  
✅ **Träna läggning** — Fokusera på tre övningstyper med zondlade resultat  
✅ **Spåra matcher** — Använd den digitala poängräknaren för singel och lagmatcher (2v2/3v3)  
✅ **Föra dagbok** — Logga träningspass och följa din utveckling över tid  
✅ **Analysera precision** — Testa dina färdigheter med precisionsskyttet enligt SBF-regler  
✅ **Hantera serier** — Admin-panel för ligahantering och matchresultat (Firebase)

**Allt utan registrering** — Data sparas lokalt på din enhet och synkroniseras offline.

---

## 🎯 Funktioner

### 🎯 **Skjutträning** (`skjuttraning.html`)
- Välj avstånd (6, 7, 8, 9m) och antal skott (10–50)
- Registrera miss/träff/carreau i realtid
- Progressbar och live-statistik
- **Statistik per avstånd** med trend och medelvärde
- Historik, rekord och grafvy
- Kalenderöversikt över träningspass
- **Export/import** av träningsdata som JSON

### 🎯 **Läggträning** (`laggtraning.html`)
- **3 övningstyper:** Precisionsmål, Avståndszoner, 3-boulerserie
- Zonindelning: Nära (0–20cm), Mitt (20–40cm), Långt (40–60cm)
- Anpassningsbar antal kast och avstånd
- Historik och statistik per övningstyp

### 🎯 **Poängräknare** (`tavlingssimulator.html`)
- Digital räknare för **singel** och **lag** (2v2/3v3)
- Anpassningsbar målpoäng och bollar per spelare
- Progressbars med bump-animation
- Rundlista med ångra-funktion

### 🎯 **Träningsdagbok** (`dagbok.html`)
- Logga datum, plats, träningstyp och känsla (1–5 stjärnor)
- Månadskalender med färgkodade dagar
- Listvy med möjlighet att ta bort inlägg
- Spåra långsiktig utveckling

### 🎯 **Precisionsskytte** (`precisionsskytte.html`)
- Baserad på **Svenska Petanqueförbundets regler** (SBF 2021-1)
- 20 skott: 5 stationer × 4 avstånd (6/7/8/9m)
- Poängregler (0/1/3/5p) visas per station
- Resultat och historik sparas

### 🏆 **Ligahantering** (`serie/`)
- **Publikvy** (`serie/index.html`) — Live-tabeller och omgångsresultat
- **Admin-panel** (`serie/admin.html`) — Skapa divisioner, lägg till lag, mata in resultat
- Set-format med automatisk aktivering
- Firebase Realtime Database som backend
- Arkivfunktion för tidigare säsonger

---

## 🛠️ Teknisk Stack

| Teknik | Användning |
|--------|-----------|
| **HTML5** | Struktur och UI |
| **CSS3** | Responsiv design, mörkt tema |
| **JavaScript (ES6)** | Logik och interaktivitet |
| **Service Worker** | Offline-support och PWA |
| **localStorage** | Lokal datalagring |
| **Firebase** | Backend för ligasystemet |
| **GitHub Pages** | Hosting |

### Design
- 🌙 **Mörkt designsystem** för ögonkomfort
- 💛 **Gul accentfärg** (#e8ff47) för visuell fokus
- 🔤 **Barlow Condensed** för displaytext
- 📱 **Fullständigt responsiv** — Fungerar på alla enheter

---

## 📦 Struktur

```
petanque-repo/
├── index.html                 # Portalsida med applokal
├── skjuttraning.html         # Skjutträningsapp
├── laggtraning.html          # Läggträningsapp
├── tavlingssimulator.html    # Poängräknare
├── dagbok.html               # Träningsdagbok
├── precisionsskytte.html     # Precisionsskytte
├── manifest.json             # PWA-manifest
├── sw.js                     # Service Worker
├── storage-manager.js        # Universal storage API
├── lang-manager.js           # Språkhantering (SV/EN)
├── offline-indicator.js      # Offline-status badge
├── serie/
│   ├── index.html           # Ligatabeller (publik)
│   └── admin.html           # Admin-panel (inloggning)
├── dokumentation/
│   ├── manual.pdf           # Användarhandbok
│   ├── QUICK-START-Checklist.md
│   ├── GA4-Dashboard-Guide.md
│   └── Avhoppningsanalys-Guide.md
├── js/
│   └── ga4-event-tracking.js # Google Analytics 4
└── icon-192.png, icon-512.png # PWA-ikoner
```

---

## 🚀 Kom igång

### Online (direkt)
Besök **[petanquetraning.se](https://petanquetraning.se)** i din webbläsare — ingen installation krävs!

### Installera som app
1. **Android:** Öppna i Chrome → "Installera app"
2. **iOS:** Öppna i Safari → Dela (↗) → "Lägg till på hemskärmen"
3. **Desktop:** Klicka "Installera" i webbläsaren

### Offline-drift
Appen fungerar **offline** när den väl är installerad. All data sparas lokalt på din enhet.

---

## 💾 Datahantering

### Lagring
- **Lokal lagring:** localStorage (ingen molnsynkronisering per default)
- **Sessioner:** Sparas automatiskt när du använder appar
- **Export:** Ladda ned data som JSON-fil
- **Import:** Importera tidigare exporterad data

### Sekuritet
- ✅ Ingen inloggning för träningsappar (bara lokalt)
- ✅ Firebase API-nyckel begränsad till `petanquetraning.se`
- ✅ Ligadministration skyddad med Firebase Authentication
- ✅ Inga känsliga personuppgifter sparas

---

## 🌍 Språkstöd

Appen stöder **svenska** och **engelska** med intelligent språkväljare:
- 🔘 Knapp i toppraden för att byta språk
- 🌐 Browser-språk detekteras automatiskt
- 💾 Inställning sparas i localStorage

---

## 📊 Analytics & Spårning

Appen använder **Google Analytics 4** för att förstå användningen:
- Vilka appar som är mest populära
- Hur länge användare tränar
- Vilka funktioner som används mest

**Ingen personlig data samlas in** — bara aggregerad statistik.

---

## 🔄 PWA & Offline

Appen är en **Progressive Web App** (PWA) med:
- 📥 Installeras på hemskärmen
- ⚡ Snabb lastning med Service Worker-caching
- 🔌 Fungerar offline efter första besöket
- 🔄 Stale-While-Revalidate caching-strategi
- 📱 App-liknande upplevelse på mobil

**Service Worker-version:** `v{YYYYMMDD}` — uppdateras automatiskt dagligen.

---

## 🛠️ Development

### Förutsättningar
- Node.js (optional, för lokal development)
- Git
- En webbläsare

### Lokal körning
```bash
# Klona repositoryt
git clone https://github.com/johanssonbvp/skyttetraning.git
cd skyttetraning

# Servera lokalt (eller öppna index.html direkt i webbläsaren)
python3 -m http.server 8000
# Sedan besök http://localhost:8000
```

### Firebase-setup (för ligasystemet)
1. Skapa ett Firebase-projekt på [console.firebase.google.com](https://console.firebase.google.com)
2. Aktivera **Realtime Database** och **Authentication** (Email/Password)
3. Uppdatera API-nyckel i `serie/index.html` och `serie/admin.html`
4. Deploy till Firebase Hosting:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

---

## 📝 Dokumentation

Se mappen `dokumentation/` för detaljerade guider:
- 📖 **manual.pdf** — Fullständig användarhandbok
- ⚡ **QUICK-START-Checklist.md** — Snabbstart för nya användare
- 📊 **GA4-Dashboard-Guide.md** — Hur man tolkar analytics
- 📉 **Avhoppningsanalys-Guide.md** — Analysera användarflöde

---

## 🚀 Deploy

Projektet är hostat på **GitHub Pages** och distribueras automatiskt när du pushar till `main`:

```bash
git add .
git commit -m "Uppdateringar"
git push origin main
```

Webbsidan uppdateras automatiskt inom några sekunder på [petanquetraning.se](https://petanquetraning.se).

---

## 📧 Kontakt & Support

- **Utvecklare:** Pär Johansson
- **GitHub:** [johanssonbvp](https://github.com/johanssonbvp)
- **Webbsida:** [petanquetraning.se](https://petanquetraning.se)
- **Länka till Svenska Petanqueförbundet:** [petanque.se](https://petanque.se)

---

## 🤝 Bidra

Har du idéer, bug-rapporter eller funktionförfrågningar?

1. **Öppna en Issue** på GitHub
2. **Forka projektet** och skapa en Pull Request
3. **Kontakta** utvecklaren direkt

---

## 📄 Licens

**MIT License** — Du är fri att använda, modifiera och distribuera denna kod.

Se [LICENSE](LICENSE) för detaljer.

---

## 🏆 Tack!

Tack för att du använder Petanque Träning! Din feedback hjälper oss att göra appen bättre. 

**Lycka till med träningen och mycket bollspel!** 🎯⚫

---

### Snabblänkar
- 🌐 [Besök webbsidan](https://petanquetraning.se)
- 📖 [Läs handboken](https://petanquetraning.se/dokumentation/manual.pdf)
- 🐛 [Rapportera bug](https://github.com/johanssonbvp/skyttetraning/issues)
- 💾 [Ladda ned data](https://petanquetraning.se)
- 🔗 [Svenska Petanqueförbundet](https://petanque.se)

---

**Senast uppdaterad:** April 2026  
**Projektet är aktivt underhållet** ✨
