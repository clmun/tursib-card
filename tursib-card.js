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

    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

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
        }
        .divider {
          border-bottom: ${dividerThickness} solid blue;
          margin-bottom: 0.5em;
        }
        .row {
          display: grid;
          grid-template-columns: ${badgeWidth} 1fr auto auto;
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
        }
        .minutes {
          font-weight: bold;
          font-size: ${minutesFontSize};
          text-align: right;
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

      // logica dinamică pentru culoarea minutelor
      let minutesColor = fallbackMinutesColor;
      if (dep.minutes === "Acum") {
        minutesColor = "red";
      } else if (!isNaN(dep.minutes) && Number(dep.minutes) < 3) {
        minutesColor = "orange";
      }

      html += `
        <div class="row">
          <span class="line-badge" style="background:${color}">${dep.line}</span>
          <span class="destination">${dep.destination}</span>
          <span class="departure">${dep.departure}</span>
          <span class="minutes" style="color:${minutesColor}">${dep.minutes}${dep.minutes !== "Acum" ? " min" : ""}</span>
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
