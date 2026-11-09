# Regler för Firebase Realtime Database

Reglerna ändras i Firebase-konsolen: **Realtime Database → Regler**. Filerna här är bara
underlag och dokumentation. De påverkar inte databasen av sig själva.

## Status
- **Steg 1** publicerades tidigare (id längre än 20 tecken).
- **Steg 2 publicerades 2026-11-09** och gäller nu: varje inloggad användare når bara sin egen
  data (`auth.uid` måste vara samma som id:t i `coaches/<id>`). Före publiceringen testades det i
  Regelsimulatorn: oinloggad nekas, inloggad som annat id nekas, inloggad som samma id tillåts.
- Vill du backa: klistra in innehållet från `steg1-stang-korta-koder.json` i Firebase och publicera.

| Fil | Vad den gör | När |
|---|---|---|
| `nuvarande-reglerna-backup.json` | Reglerna som gällde före steg 1 (för att kunna backa) | Spara, publicera inte |
| `steg1-stang-korta-koder.json` | Stänger gamla korta koder (t.ex. `1234`). Vanliga konton märker inget | Publicerad tidigare. Används för att backa från steg 2 |
| `steg2-bara-egen-data.json` | Varje inloggad användare når bara sin egen data | **Publicerad 2026-11-09** (gäller nu) |

## Varför steg 2 väntade
De gamla sidorna skickade ingen inloggning till databasen. Med steg 2 nekas deras sparningar,
och den gamla `saveToFirebase` sparade inloggade användares data bara i molnet. Därför väntade
vi tills de nya sidorna (med `firebase-auth` och `auth-gate.js`) varit live en tid. Appen
hämtar den nya versionen i bakgrunden första gången den öppnas, så en gammal installation kan
behöva öppnas en eller två gånger med internet innan den synkar igen.

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
