class TursibCard extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
    this._selectedStation = null; // nu mai depindem de config
  }

  set hass(hass) {
    const entityMap = this._config.entity_map || null;

    // ✅ AUTO detect stations dacă nu există config
    let options = [];
    if (entityMap) {
      options = Object.keys(entityMap);
      this._selectedStation =
        this._selectedStation || this._config.default_station || options[0];
    } else {
      // autodetect toate entity-urile tursib
      options = Object.keys(hass.states)
        .filter(e => e.startsWith("sensor.tursib_station"));

      if (!options.length) return;

      this._selectedStation = this._selectedStation || options[0];
    }

    // ✅ alegem entity
    let entityId;
    if (entityMap) {
      entityId = entityMap[this._selectedStation];
    } else {
      entityId = this._selectedStation;
    }

    const entity = hass.states[entityId];
    if (!entity) return;

    const data = entity.attributes.departures || [];

    // ✅ eliminate config heavy -> DEFAULTS SMART
    const cardTitle = this._config.card_title || "Tursib";
    const showHeader = this._config.show_header !== false;

    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // ✅ selector simplu
    const selectorHtml = `
      <select id="stationSelect">
        ${options.map(opt => `
          <option value="${opt}" ${opt === this._selectedStation ? "selected" : ""}>
            ${entityMap ? opt : hass.states[opt]?.attributes?.friendly_name || opt}
          </option>
        `).join("")}
      </select>
    `;

    // ✅ PALETĂ AUTOMATĂ (fără config)
    const palette = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e67e22"];

    const getLineColor = (line) => {
      let hash = 0;
      for (let i = 0; i < line.length; i++) {
        hash += line.charCodeAt(i);
      }
      return palette[hash % palette.length];
    };

    // ✅ RULE ENGINE intern (ca smart-room)
    const getRowStyle = (dep) => {
      if (dep.minutes === "Acum") {
        return "background:red; color:white;";
      }
      if (!isNaN(dep.minutes) && dep.minutes <= 3) {
        return "background:orange; color:black;";
      }
      return "";
    };

    let html = `
      <style>
        .card {
          font-family: sans-serif;
          padding: 12px;
          border-radius: 14px;
          background: #f9f9f9;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .row {
          display: grid;
          grid-template-columns: 3em 1fr 6ch 6ch;
          gap: 10px;
          margin: 6px 0;
          align-items: center;
        }
        .badge {
          text-align: center;
          border-radius: 6px;
          color: white;
          font-weight: bold;
          padding: 3px;
        }
        .destination {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .minutes {
          text-align: right;
          font-weight: bold;
        }
        .time {
          text-align: right;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
      </style>

      <div class="card">
        ${showHeader ? `
          <div class="header">
            <div>
              <strong>${cardTitle}</strong><br>
              ${selectorHtml}
            </div>
            <div>${currentTime}</div>
          </div>
        ` : ""}
    `;

    data.slice(0, 5).forEach(dep => {

      const color = getLineColor(dep.line);

      const style = getRowStyle(dep);

      const minutesText =
        dep.minutes === "Acum" ? "Acum" : `${dep.minutes} min`;

      html += `
        <div class="row" style="${style}">
          <div class="badge" style="background:${color}">${dep.line}</div>
          <div class="destination">${dep.destination}</div>
          <div class="minutes">${minutesText}</div>
          <div class="time">${dep.departure}</div>
        </div>
      `;
    });

    html += `</div>`;

    this.innerHTML = html;

    // ✅ event simplu
    setTimeout(() => {
      const select = this.querySelector("#stationSelect");
      if (select) {
        select.addEventListener("change", (e) => {
          this._selectedStation = e.target.value;
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