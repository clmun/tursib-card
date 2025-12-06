class TursibCard extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  set hass(hass) {
    const entity = hass.states[this._config.entity];
    if (!entity) return;

    const data = entity.attributes.departures || [];
    const height = this._config.card_height || "auto";
    const badgeWidth = this._config.badge_width || "3em";

    let html = `
      <style>
        .tursib-card {
          font-family: sans-serif;
          padding: 0.5em;
          height: ${height};
          overflow-y: auto;
        }
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0.3em 0;
        }
        .line-badge {
          display: inline-block;
          width: ${badgeWidth};   /* configurabil din YAML */
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
        }
        .departure {
          margin-left: 0.5em;
          font-weight: bold;
        }
      </style>
      <div class="tursib-card">
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
