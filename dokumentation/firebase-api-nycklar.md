# Firebase: API-nycklar och tillåtna webbadresser

Projektet `databas-serie` har två API-nycklar i Google Cloud
(console.cloud.google.com → APIs & Services → Credentials). Båda är begränsade
till vissa webbadresser ("HTTP-referrer"). Själva nycklarna står aldrig i
dokumentationen.

| Nyckel | Används av | Måste släppa in |
|---|---|---|
| seriehanterare | Appen (firebaseConfig i koden) | petanquetraning.se, www.petanquetraning.se, databas-serie.firebaseapp.com, databas-serie.web.app, johanssonbvp.github.io |
| Browser key (auto created by Firebase) | Länken i lösenordsmailet | Samma adresser som ovan, framför allt `https://databas-serie.firebaseapp.com/*` |

## Varför det är viktigt
Länken i mailet "Glömt lösenord" går till Firebases egen sida
`databas-serie.firebaseapp.com/__/auth/action`. Om nyckeln inte släpper in just
den adressen blockeras sidan, och användaren får felet
"your request to reset your password has expired or the link has already been
used", trots att länken är ny.

Så löstes det 2026-11-07: adressen `https://databas-serie.firebaseapp.com/*`
(och web.app) lades till på "Browser key". Därefter fungerade återställningen.

## Om det händer igen
1. Får en användare "länken har gått ut eller redan använts" direkt? Kontrollera
   först webbadresslistan på båda nycklarna.
2. Skicka ett nytt mail och öppna länken direkt, utan att klicka flera gånger.
3. Ändringar i Google Cloud kan ta några minuter innan de gäller.

Obs: Ändra inte nycklarna utan att veta vad som används. Tar man bort en adress
kan inloggning eller synk sluta fungera.
