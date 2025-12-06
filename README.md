# Tursib Card

Un card custom pentru Home Assistant care afișează plecările autobuzelor Tursib.

## Instalare prin HACS
1. Adaugă repository-ul în HACS → Custom repositories → URL GitHub → tip **Frontend**.
2. Instalează cardul.
3. Adaugă în Lovelace:

```yaml
type: custom:tursib-card
entity: sensor.tursib_station_4182
colors:
  "11": "#00ff00"
  "1": "#ff0000"
  "14": "#800080"
