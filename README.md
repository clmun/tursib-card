# Tursib Card

Un card custom pentru Home Assistant Lovelace care afișează în timp real plecările din stațiile Tursib. 
Cardul utilizează datele furnizate de integrarea **[[Tursib Bus Departures]](https://github.com/clmun/tursib)** și oferă o interfață prietenoasă și personalizabilă.
Suportă selecția stației (dropdown sau butoane), layout fix sau fluid, culori configurabile și stil personalizat.

## 📸 Capturi de ecran
### Varianta cu dropdown 
![Captură de ecran 1](https://raw.githubusercontent.com/clmun/tursib-card/master/images/Station_1.png)

### Varianta cu butoane
![Captură de ecran 2](https://raw.githubusercontent.com/clmun/tursib-card/master/images/Station_2.png)

## Instalare prin HACS
1. Adaugă repository-ul în HACS → Custom repositories → URL GitHub → tip **Dashboard**.
2. Instalează cardul.
3. Adaugă în Lovelace:


## 📝 Configurare

Exemplu complet:
```yaml
type: custom:tursib-card
entity_map:
  "Primăverii 1": sensor.tursib_primaverii_1
  "Gara": sensor.tursib_gara
  "Aeroport": sensor.tursib_aeroport
default_station: "Primăverii 1"

# Titlu card
card_title: "Tursib Departures"

# Selector stație: dropdown | buttons | none
station_selector: buttons

# Afișează / ascunde header și oră
show_header: true
show_current_time: true

# Format oră: 24h | 12h
time_format: 24h

# Culoare titlu și text badge
title_color: "#222222"
badge_text_color: "#ffffff"

# Culoare text pentru stația curentă (buttons)
station_label_color: "#ff6600"

# Layout: fixed | fluid
layout_mode: fluid

# Afișează eticheta stației când selectorul este oprit
show_station_title: true

# Spațiere între rânduri
row_gap: 0.4em

# Stil card
card_background: "#ffffff"
card_radius: 12px
card_height: 220px
card_width: 400px
badge_width: 3em
destination_width: 200px

destination_font_size: 14px
departure_font_size: 16px
minutes_font_size: 18px

minutes_color: green
divider_color: blue
divider_thickness: 2px

# Culori pentru linii
colors:
  "1": "#007b00"
  "2": "#ff0000"

```
## 📊 Opțiuni disponibile

| Opțiune               | Tip    | Default      | Descriere                                                    |
|-----------------------|--------|--------------|--------------------------------------------------------------|
| `entity_map`          | dict   | obligatoriu  | Mapare stații → senzori                                      |
| `default_station`     | string | prima stație | Stația afișată la încărcare                                  |
| `station_selector`    | string | `dropdown`   | Tip selector: `dropdown` sau `buttons`                       |
| `station_label_color` | string | `#000`       | Culoare text stație (buttons)                                |
| `badge_text_color`    | string | `#fff`       | Culoare text pentru badge                                     |
| `card_title`          | string | empty        | Titlul cardului afișat în header                             |
| `title_color`         | string | `#111`       | Culoare text titlu                                           |
| `show_header`         | bool   | `true`       | Afișează sau ascunde header-ul cardului                      |
| `show_current_time`   | bool   | `true`       | Afișează sau ascunde ora curentă                             |
| `time_format`         | string | `24h`        | Format oră: `24h` sau `12h`                                  |
| `show_station_title`  | bool   | `true`       | Afișează eticheta stației când selectorul este `none`        |
| `layout_mode`         | string | `fixed`      | `fixed` (dimensiuni rigide) sau `fluid` (compatibil Section) |
| `card_background`     | string | `#f9f9f9`    | Fundal card                                                  |
| `card_radius`         | string | `12px`       | Colțuri rotunjite                                            |
| `card_height`         | string | `auto`       | Înălțime card                                                |
| `card_width`          | string | `400px`      | Lățime card                                                  |
| `badge_width`         | string | `3em`        | Lățime badge linie                                            |
| `destination_width`   | string | `200px`      | Lățime coloană destinație (fixed)                            |
| `destination_font_size` | string | `14px`     | Dimensiune text destinație                                   |
| `departure_font_size` | string | `16px`       | Dimensiune text plecare                                      |
| `minutes_font_size`   | string | `18px`       | Dimensiune text minute                                        |
| `minutes_color`       | string | `green`      | Culoare implicită pentru minute                               |
| `divider_color`       | string | `blue`       | Culoare linie separator                                       |
| `divider_thickness`   | string | `2px`        | Grosimea liniei separator                                    |
| `row_gap`             | string | `0.4em`      | Spațierea dintre rânduri                                      |
| `colors`              | dict   | `#007b00`    | Culori pentru badge-uri de linie                             |

## 🚀 Funcționalități

- Afișează plecările în timp real din senzorii Tursib.
- Selector stație: dropdown sau butoane navigare.
- Layout dual: fixed (control complet) sau fluid (compatibil Dashboard Section).
- Personalizare culori pentru badge-uri și text.
- Stil card configurabil (fundal, colțuri, dimensiuni).
- Tooltip pentru destinații lungi.
- Cod robust, cu fallback pentru minute („Acum”, <3 min → roșu/orange).

## 🛠 Roadmap / Idei viitoare
- Integrare cu HACS pentru instalare ușoară.
- Opțiuni avansate de stil (teme, fonturi).
- Posibilitatea de a grupa stațiile favorite.

## ☕ Susține dezvoltatorul

Dacă ți-a plăcut această integrare și vrei să sprijini munca depusă, **invită-mă la o cafea**! 🫶  
Nu costă nimic, iar contribuția ta ajută la dezvoltarea viitoare a proiectului. 🙌  

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Susține%20dezvoltatorul-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/clmun01c)

Mulțumesc pentru sprijin și apreciez fiecare gest de susținere! 🤗