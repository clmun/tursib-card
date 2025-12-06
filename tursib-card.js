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
    const badgeWidth = this._config.badge_width || "3em";
    const destinationFontSize = this._config.destination_font_size || "14px";
    const minutesFontSize = this._config.minutes_font_size || "18px";
    const dividerThickness = this._config.divider_thickness || "2px";

    // ora actuală
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    let html = `
      <style>
        .tursib-card {
          font-family: sans-serif;
          padding: 0.5em;
          height: ${height};
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
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          flex: 1;
          margin-left: 0.5em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: ${destinationFontSize};
        }
        .departure {
          margin-left: 0.5em;
          font-weight: bold;
          font-size: ${minutesFontSize};
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
      html += `
        <div class="row">
          <span class="line-badge" style="background:${color}">${dep.line}</span>
          <span class="destination">${dep.destination}</span>
          <span class="departure">${dep.departure} (${dep.minutes} min)</span>
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
