class TursibCard extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._selectedStation = config.default_station || Object.keys(config.entity_map)[0];
  }

  set hass(hass) {
    const entityMap = this._config.entity_map || {};
    const options = Object.keys(entityMap);
    const currentStation = this._selectedStation;

    const entityId = entityMap[currentStation];
    const entity = hass.states[entityId];
    if (!entity) return;

    const data = entity.attributes.departures || [];

    // Config valori
    const height = this._config.card_height || "auto";
    const width = this._config.card_width || "400px";
    const badgeWidth = this._config.badge_width || "3em";
    const destinationWidth = this._config.destination_width || "200px";
    const destinationFontSize = this._config.destination_font_size || "14px";
    const departureFontSize = this._config.departure_font_size || "16px";
    const minutesFontSize = this._config.minutes_font_size || "18px";
    const fallbackMinutesColor = this._config.minutes_color || "green";
    const dividerThickness = this._config.divider_thickness || "2px";
    const stationLabelColor = this._config.station_label_color || "#000";
    const layoutMode = this._config.layout_mode || "fixed"; // fixed sau fluid
    const cardBackground = this._config.card_background || "#f9f9f9";
    const cardRadius = this._config.card_radius || "12px";

    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // Alegem tipul de selector
    let selectorHtml = "";
    if (this._config.station_selector === "dropdown") {
      selectorHtml = `
        <select class="station-select" id="stationSelect">
          ${options.map(opt => `
            <option value="${opt}" ${opt === currentStation ? "selected" : ""}>${opt}</option>
          `).join("")}
        </select>
      `;
    } else if (this._config.station_selector === "buttons") {
      selectorHtml = `
        <button id="prevStation">◀</button>
        <span class="station-label">${currentStation}</span>
        <button id="nextStation">▶</button>
      `;
    }

    // CSS diferit pentru fixed vs fluid
    let cardStyle = "";
    if (layoutMode === "fixed") {
      cardStyle = `
        .tursib-card {
          height: ${height};
          width: ${width};
          box-sizing: border-box;
          overflow-y: auto;
        }
        .row {
          display: grid;
          grid-template-columns: ${badgeWidth} ${destinationWidth} 7ch 6ch;
        }
      `;
    } else { // fluid
      cardStyle = `
        .tursib-card {
          height: auto;
          width: 100%;
          max-width: ${width};
          box-sizing: border-box;
          overflow-y: auto;
        }
        .row {
          display: grid;
          grid-template-columns: ${badgeWidth} 1fr 7ch 6ch;
        }
      `;
    }

    let html = `
      <style>
        ${cardStyle}
        .tursib-card {
          font-family: sans-serif;
          padding: 0.8em;
          background: ${cardBackground};
          border-radius: ${cardRadius};
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .station-select {
          font-size: 14px;
          padding: 0.2em;
        }
        .station-label {
          font-size: 14px;
          margin: 0 0.5em;
          font-weight: bold;
          color: ${stationLabelColor};
        }
        .divider {
          border-bottom: ${dividerThickness} solid blue;
          margin-bottom: 0.5em;
        }
        .row {
          align-items: center;
          column-gap: 1em;       /* distanță mai mare între badge și destinație */
          margin: 0.4em 0;
          line-height: 1.4em;
        }
        .line-badge {
          flex-shrink: 0;
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .minutes {
          font-weight: bold;
          font-size: ${minutesFontSize};
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .departure {
          font-weight: bold;
          font-size: ${departureFontSize};
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
      </style>
      <div class="tursib-card">
        <div class="header">
          ${selectorHtml}
          <span>${currentTime}</span>
        </div>
        <div class="divider"></div>
    `;

    data.forEach(dep => {
      const color = this._config.colors?.[dep.line] || "#007b00";

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
          <span class="destination" title="${dep.destination}">${dep.destination}</span>
          <span class="minutes" style="color:${minutesColor}">${minutesText}</span>
          <span class="departure">${dep.departure}</span>
        </div>
      `;
    });

    html += `</div>`;
    this.innerHTML = html;

    // Event listeners
    setTimeout(() => {
      if (this._config.station_selector === "dropdown") {
        const selectEl = this.querySelector("#stationSelect");
        if (selectEl) {
          selectEl.addEventListener("change", (e) => {
            this._selectedStation = e.target.value;
            this.hass = hass;
          });
        }
      } else if (this._config.station_selector === "buttons") {
        const prevBtn = this.querySelector("#prevStation");
        const nextBtn = this.querySelector("#nextStation");
        if (prevBtn) prevBtn.addEventListener("click", () => {
          const idx = options.indexOf(this._selectedStation);
          this._selectedStation = options[(idx - 1 + options.length) % options.length];
          this.hass = hass;
        });
        if (nextBtn) nextBtn.addEventListener("click", () => {
          const idx = options.indexOf(this._selectedStation);
          this._selectedStation = options[(idx + 1) % options.length];
          this.hass = hass;
        });
      }
    }, 0);
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("tursib-card", TursibCard);
