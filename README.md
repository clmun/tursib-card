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
```

## ☕ Susține dezvoltatorul

Dacă ți-a plăcut această integrare și vrei să sprijini munca depusă, **invită-mă la o cafea**! 🫶  
Nu costă nimic, iar contribuția ta ajută la dezvoltarea viitoare a proiectului. 🙌  

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Susține%20dezvoltatorul-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/clmun01c)

Mulțumesc pentru sprijin și apreciez fiecare gest de susținere! 🤗