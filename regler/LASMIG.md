# Regler för Firebase Realtime Database

Reglerna ändras i Firebase-konsolen: **Realtime Database → Regler**. Filerna här är bara
underlag och dokumentation. De påverkar inte databasen av sig själva.

| Fil | Vad den gör | När |
|---|---|---|
| `nuvarande-reglerna-backup.json` | Reglerna som gällde före ändringen (för att kunna backa) | Spara, publicera inte |
| `steg1-stang-korta-koder.json` | Stänger gamla korta koder (t.ex. `1234`). Vanliga konton märker inget | Kan publiceras direkt |
| `steg2-bara-egen-data.json` | Varje inloggad användare når bara sin egen data | Först när de nya sidorna (med `firebase-auth` och `auth-gate.js`) varit live 2–4 veckor |

## Varför steg 2 inte kan göras direkt
De gamla sidorna skickar ingen inloggning till databasen. Med steg 2 skulle deras sparningar
nekas, och den gamla `saveToFirebase` sparar inloggade användares data bara i molnet. Appen
hämtar den nya versionen i bakgrunden första gången den öppnas.

## Så här publicerar du en regelfil
1. Öppna Regler-fliken och kopiera de nuvarande reglerna till `nuvarande-reglerna-backup.json`.
2. Klistra in innehållet från rätt fil.
3. Testa i **Regelsimulatorn** (Rules playground):
   - Steg 1: läs `/coaches/1234` ska nekas. Läs `/coaches/<ett långt id>` ska tillåtas.
   - Steg 2: läs `/coaches/<id>` oinloggad ska nekas. Inloggad som samma id ska tillåtas.
     Inloggad som ett annat id ska nekas.
4. Tryck **Publicera**.

## Att tänka på
- Gamla korta koder (`1234`, `BVPTEST`, `TRIX`) blir oåtkomliga. Datat tas inte bort av reglerna.
  Ta bort eller flytta det själv i konsolen när du bestämt dig.
- Grenen `petanque` (den gamla seriesidan) saknar regler och är därför redan stängd.
- Reglerna är inte hemliga. Säkerheten ligger i vad de tillåter, inte i att de är dolda.
