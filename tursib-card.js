class TursibCard extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  set hass(hass) {
    const entity = hass.states[this._config.entity];
    if (!entity) return;

    const data = entity.attributes.departures || [];
    const station = entity.attributes.station || "Stație necunoscută";

    const height = this._config.card_height || "auto";
    const width = this._config.card_width || "auto";
    const badgeWidth = this._config.badge_width || "3em";
    const destinationFontSize = this._config.destination_font_size || "14px";
    const departureFontSize = this._config.departure_font_size || "16px";
    const minutesFontSize = this._config.minutes_font_size || "18px";
    const fallbackMinutesColor = this._config.minutes_color || "green";
    const dividerThickness = this._config.divider_thickness || "2px";

    // 24h current time
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    let html = `
      <style>
        .tursib-card {
          font-family: sans-serif;
          padding: 0.5em;
          height: ${height};
          max-width: ${width};
          display: inline-block;
          overflow-y: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          margin-bottom: 0.5em;
          font-variant-numeric: tabular-nums; /* align numeric */
        }
        .divider {
          border-bottom: ${dividerThickness} solid blue;
          margin-bottom: 0.5em;
        }
        /* Grid: badge | destination | departure | minutes */
        .row {
          display: grid;
          grid-template-columns: ${badgeWidth} 1fr 6ch 7ch; /* fixed character widths */
          align-items: center;
          gap: 0.5em;
          margin: 0.3em 0;
        }
        .line-badge {
          display: inline-block;
          width: ${badgeWidth};
          text-align: center;
          border-radius: 4px;
          padding: 0.2em;
          color: white;
          font-weight: bold;
          font-variant-numeric: tabular-nums;
        }
        .destination {
          font-size: ${destinationFontSize};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .departure {
          font-weight: bold;
          font-size: ${departureFontSize};
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .minutes {
          font-weight: bold;
          font-size: ${minutesFontSize};
          text-align: right; /* always right */
          font-variant-numeric: tabular-nums;
        }
      </style>
      <div class="tursib-card">
        <div class="header">
          <span>${station}</span>
          <span>${currentTime}</span>
        </div>
        <div class="divider"></div>
    `;

    data.forEach(dep => {
      const color = this._config.colors?.[dep.line] || "#007b00";

      // dynamic minutes color
      let minutesColor = fallbackMinutesColor;
      if (dep.minutes === "Acum") {
        minutesColor = "red";
      } else if (!isNaN(dep.minutes) && Number(dep.minutes) < 3) {
        minutesColor = "orange";
      }

      const minutesText = dep.minutes === "Acum" ? "Acum" : `${dep.minutes} min`;

      html += `
        <div class="row">
          <span class="line-badge" style="background:${color}">${dep.line}</span>
          <span class="destination">${dep.destination}</span>
          <span class="departure">${dep.departure}</span>
          <span class="minutes" style="color:${minutesColor}">${minutesText}</span>
        </div>
      `;
    });

    html += `</div>`;
    this.innerHTML = html;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("tursib-card", TursibCard);
