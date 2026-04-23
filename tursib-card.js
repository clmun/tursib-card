// tursib-card.js v2.0.0
// Full rewrite — modern design, compact rows, live countdown, complete visual editor

const TURSIB_CARD_VERSION = "2.0.0";

class TursibCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this._selectedStation = null;
    this._tickInterval = null;
    this._lastSignature = null;
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    if (!config.entity_map || Object.keys(config.entity_map).length === 0) {
      throw new Error("tursib-card: entity_map is required and must have at least one station.");
    }
    this._config = config;
    if (!this._selectedStation || !config.entity_map[this._selectedStation]) {
      this._selectedStation = config.default_station || Object.keys(config.entity_map)[0];
    }
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
    this._startTick();
  }

  _startTick() {
    if (this._tickInterval) return;
    this._tickInterval = setInterval(() => this._updateMinutes(), 10000);
  }

  disconnectedCallback() {
    if (this._tickInterval) {
      clearInterval(this._tickInterval);
      this._tickInterval = null;
    }
  }

  _getConfig(key, fallback) {
    return this._config[key] !== undefined ? this._config[key] : fallback;
  }

  _signature(data, station) {
    return station + JSON.stringify(data);
  }

  _render() {
    if (!this._hass || !this._config) return;

    const entityMap = this._config.entity_map || {};
    const station = this._selectedStation;
    const entityId = entityMap[station];
    const entity = this._hass.states[entityId];

    const data = entity?.attributes?.departures || [];
    const sig = this._signature(data, station);
    if (sig === this._lastSignature) return;
    this._lastSignature = sig;

    // Config
    const layoutMode      = this._getConfig("layout_mode", "fluid");
    const selectorType    = this._getConfig("station_selector", "buttons");
    const cardBg          = this._getConfig("card_background", "");
    const cardRadius      = this._getConfig("card_radius", "12px");
    const cardHeight      = this._getConfig("card_height", "auto");
    const cardWidth       = this._getConfig("card_width", "100%");
    const stationColor    = this._getConfig("station_label_color", "var(--primary-text-color, #fff)");
    const destSize        = this._getConfig("destination_font_size", "12px");
    const depSize         = this._getConfig("departure_font_size", "12px");
    const minSize         = this._getConfig("minutes_font_size", "14px");
    const dividerColor    = this._getConfig("divider_color", "var(--divider-color, rgba(255,255,255,0.12))");
    const warnYellow      = parseInt(this._getConfig("warn_minutes_yellow", 5));
    const warnRed         = parseInt(this._getConfig("warn_minutes_red", 2));
    const maxRows         = parseInt(this._getConfig("max_departures", 8));
    const showHeader      = this._getConfig("show_header", true);
    const showTime        = this._getConfig("show_current_time", true);
    const badgeWidth      = this._getConfig("badge_width", "2.6em");

    const options = Object.keys(entityMap);
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    const useDarkBg = !cardBg;
    const bgStyle = cardBg ? `background:${cardBg}` : `background:var(--ha-card-background, var(--card-background-color, #1c1c1e))`;

    // Station selector HTML
    let selectorHtml = "";
    if (selectorType === "dropdown") {
      selectorHtml = `
        <select class="station-select" id="stationSelect" title="Select station">
          ${options.map(o => `<option value="${o}" ${o === station ? "selected" : ""}>${o}</option>`).join("")}
        </select>`;
    } else {
      selectorHtml = `
        <div class="btn-nav">
          <button class="nav-btn" id="prevStation" aria-label="Previous station">&#8249;</button>
          <span class="station-label" id="stationLabel">${station}</span>
          <button class="nav-btn" id="nextStation" aria-label="Next station">&#8250;</button>
        </div>`;
    }

    // Build rows
    const visibleData = data.slice(0, maxRows);
    let rowsHtml = "";

    if (!entity) {
      rowsHtml = `<div class="no-data">⚠ Entity not found: ${entityId}</div>`;
    } else if (visibleData.length === 0) {
      rowsHtml = `<div class="no-data">No departures available</div>`;
    } else {
      visibleData.forEach((dep, i) => {
        const lineColor = this._config.colors?.[dep.line] || "#007b00";
        const mins = dep.minutes;
        let minColor = "var(--success-color, #4caf50)";
        let minText = "";
        let isNow = false;

        if (mins === "Acum" || mins === "Now" || mins === 0 || mins === "0") {
          minColor = "var(--error-color, #f44336)";
          minText = "now";
          isNow = true;
        } else {
          const n = parseInt(mins);
          if (!isNaN(n)) {
            if (n <= warnRed) minColor = "var(--error-color, #f44336)";
            else if (n <= warnYellow) minColor = "var(--warning-color, #ff9800)";
            minText = `${n}<small>min</small>`;
          } else {
            minText = String(mins);
          }
        }

        const isDivided = i > 0;
        rowsHtml += `
          <div class="dep-row${isDivided ? " divided" : ""}" data-minutes="${mins}" data-departure="${dep.departure}">
            <span class="line-badge" style="background:${lineColor}">${dep.line}</span>
            <span class="destination" title="${dep.destination}">${dep.destination}</span>
            <span class="dep-time">${dep.departure}</span>
            <span class="minutes ${isNow ? "now-pulse" : ""}" style="color:${minColor}">${minText}</span>
          </div>`;
      });
    }

    const widthStyle = layoutMode === "fixed" ? `width:${cardWidth};` : `width:100%;`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Roboto Condensed', 'Roboto', 'Noto Sans', sans-serif;
        }
        .card {
          ${bgStyle};
          border-radius: ${cardRadius};
          overflow: hidden;
          ${widthStyle}
          height: ${cardHeight};
          ${cardHeight !== "auto" ? "overflow-y: auto;" : ""}
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          box-sizing: border-box;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.55em 0.75em 0.45em;
          border-bottom: 1px solid ${dividerColor};
          min-height: 2.2em;
        }
        .station-select {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: ${stationColor};
          border-radius: 6px;
          padding: 0.2em 0.4em;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          max-width: 180px;
        }
        .station-select:focus { outline: none; border-color: rgba(255,255,255,0.4); }
        .btn-nav {
          display: flex;
          align-items: center;
          gap: 0.3em;
        }
        .nav-btn {
          background: rgba(255,255,255,0.08);
          border: none;
          color: ${stationColor};
          border-radius: 5px;
          width: 1.8em;
          height: 1.8em;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          padding: 0;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.18); }
        .nav-btn:active { background: rgba(255,255,255,0.28); }
        .station-label {
          font-size: 13px;
          font-weight: 600;
          color: ${stationColor};
          min-width: 80px;
          text-align: center;
          letter-spacing: 0.02em;
        }
        .current-time {
          font-size: 12px;
          font-variant-numeric: tabular-nums;
          opacity: 0.55;
          letter-spacing: 0.04em;
        }
        .dep-row {
          display: grid;
          grid-template-columns: ${badgeWidth} 1fr 4.5em 3.8em;
          align-items: center;
          gap: 0.5em;
          padding: 0.28em 0.75em;
          transition: background 0.12s;
        }
        .dep-row:hover { background: rgba(255,255,255,0.04); }
        .dep-row.divided {
          border-top: 1px solid ${dividerColor};
        }
        .line-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${badgeWidth};
          height: 1.55em;
          border-radius: 4px;
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.01em;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          flex-shrink: 0;
        }
        .destination {
          font-size: ${destSize};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.88;
          color: var(--primary-text-color, #fff);
        }
        .dep-time {
          font-size: ${depSize};
          text-align: right;
          font-variant-numeric: tabular-nums;
          opacity: 0.5;
          color: var(--primary-text-color, #fff);
          letter-spacing: 0.02em;
        }
        .minutes {
          font-size: ${minSize};
          font-weight: 700;
          text-align: right;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.01em;
        }
        .minutes small {
          font-size: 0.65em;
          font-weight: 400;
          opacity: 0.75;
          margin-left: 1px;
        }
        @keyframes nowPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .now-pulse { animation: nowPulse 1.2s ease-in-out infinite; }
        .no-data {
          padding: 1em 0.75em;
          font-size: 13px;
          opacity: 0.5;
          color: var(--primary-text-color, #fff);
          text-align: center;
        }
      </style>
      <ha-card class="card">
        ${showHeader ? `
        <div class="header">
          ${selectorHtml}
          ${showTime ? `<span class="current-time" id="clockDisplay">${currentTime}</span>` : ""}
        </div>` : ""}
        <div class="rows" id="depRows">
          ${rowsHtml}
        </div>
      </ha-card>
    `;

    // Event listeners
    if (selectorType === "dropdown") {
      const sel = this.shadowRoot.querySelector("#stationSelect");
      if (sel) sel.addEventListener("change", e => {
        this._selectedStation = e.target.value;
        this._lastSignature = null;
        this._render();
      });
    } else {
      const prev = this.shadowRoot.querySelector("#prevStation");
      const next = this.shadowRoot.querySelector("#nextStation");
      if (prev) prev.addEventListener("click", () => {
        const idx = options.indexOf(this._selectedStation);
        this._selectedStation = options[(idx - 1 + options.length) % options.length];
        this._lastSignature = null;
        this._render();
      });
      if (next) next.addEventListener("click", () => {
        const idx = options.indexOf(this._selectedStation);
        this._selectedStation = options[(idx + 1) % options.length];
        this._lastSignature = null;
        this._render();
      });
    }
  }

  _updateMinutes() {
    // Live clock update only — full re-render handled by HA hass setter
    const clock = this.shadowRoot?.querySelector("#clockDisplay");
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    }
  }

  getCardSize() {
    const max = parseInt(this._getConfig("max_departures", 8));
    return Math.ceil(max / 3) + 1;
  }

  static getConfigElement() {
    return document.createElement("tursib-card-editor");
  }

  static getStubConfig() {
    return {
      entity_map: { "Exemplu stație": "sensor.tursib_exemplu" },
      station_selector: "buttons",
      layout_mode: "fluid",
      colors: { "1": "#007b00", "2": "#c00000" }
    };
  }
}

customElements.define("tursib-card", TursibCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "tursib-card",
  name: "Tursib Card",
  description: "Real-time Tursib bus departures for Home Assistant",
  preview: true,
  documentationURL: "https://github.com/clmun/tursib-card"
});