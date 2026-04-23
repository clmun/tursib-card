// tursib-card-editor.js v2.0.0
// Full visual editor — no YAML needed

class TursibCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._activeTab = "stations";
    this._hasHuiGlanceLoaded = false;
  }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config)); // deep clone
    this._render();
  }

  async connectedCallback() {
    // Force HA to load ha-entity-picker
    try {
      await customElements.whenDefined("hui-glance-card");
      const glance = document.createElement("hui-glance-card");
      if (glance.getConfigElement) await glance.getConfigElement();
    } catch (e) {}
    this._render();
  }

  _cfg(key, fallback) {
    return this._config[key] !== undefined ? this._config[key] : fallback;
  }

  _set(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fireConfigChanged();
  }

  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    }));
  }

  _render() {
    const tab = this._activeTab;
    this.innerHTML = `
      <style>
        .editor {
          font-family: var(--mdc-typography-body2-font-family, Roboto, sans-serif);
          font-size: 14px;
          color: var(--primary-text-color);
        }
        .tabs {
          display: flex;
          border-bottom: 2px solid var(--divider-color);
          margin-bottom: 16px;
          gap: 2px;
        }
        .tab-btn {
          padding: 7px 14px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: var(--secondary-text-color);
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          border-radius: 4px 4px 0 0;
          transition: color 0.15s, border-color 0.15s;
          font-family: inherit;
        }
        .tab-btn.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }
        .tab-btn:hover { color: var(--primary-text-color); }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--secondary-text-color);
          margin: 18px 0 8px;
        }
        .section-title:first-child { margin-top: 0; }

        .field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 8px;
        }
        .field-label {
          font-size: 13px;
          color: var(--primary-text-color);
          flex: 1;
          min-width: 120px;
        }
        .field-sub {
          font-size: 11px;
          color: var(--secondary-text-color);
          display: block;
          margin-top: 2px;
        }
        input[type="text"], input[type="number"], select {
          background: var(--secondary-background-color, rgba(0,0,0,0.06));
          border: 1px solid var(--divider-color);
          border-radius: 6px;
          color: var(--primary-text-color);
          padding: 5px 8px;
          font-size: 13px;
          font-family: inherit;
          min-width: 0;
        }
        input[type="text"]:focus, input[type="number"]:focus, select:focus {
          outline: none;
          border-color: var(--primary-color);
        }
        input.wide, select.wide { width: 180px; }
        input.narrow { width: 70px; }

        input[type="color"] {
          width: 36px;
          height: 28px;
          border: 1px solid var(--divider-color);
          border-radius: 5px;
          padding: 1px 2px;
          background: none;
          cursor: pointer;
        }
        input[type="range"] {
          flex: 1;
          accent-color: var(--primary-color);
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        ha-switch { --mdc-theme-secondary: var(--primary-color); }

        /* Station list */
        .station-list { margin-bottom: 12px; }
        .station-item {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 6px;
          align-items: center;
          margin-bottom: 6px;
          background: var(--secondary-background-color, rgba(0,0,0,0.04));
          border-radius: 8px;
          padding: 6px 8px;
        }
        .station-item input[type="text"] { width: 100%; box-sizing: border-box; }
        .remove-btn {
          background: none;
          border: none;
          color: var(--error-color, #f44336);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: inherit;
        }
        .remove-btn:hover { background: rgba(244,67,54,0.1); }
        .add-btn {
          background: var(--primary-color);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 500;
          transition: opacity 0.15s;
        }
        .add-btn:hover { opacity: 0.85; }
        .add-btn.secondary {
          background: var(--secondary-background-color, rgba(0,0,0,0.08));
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color);
        }

        /* Color list */
        .color-list { margin-bottom: 12px; }
        .color-item {
          display: grid;
          grid-template-columns: 70px 1fr auto;
          gap: 8px;
          align-items: center;
          margin-bottom: 6px;
        }
        .color-item input[type="text"] { text-align: center; }

        .hint {
          font-size: 11px;
          color: var(--secondary-text-color);
          margin-top: -6px;
          margin-bottom: 10px;
          line-height: 1.4;
        }
        .divider-line {
          border: none;
          border-top: 1px solid var(--divider-color);
          margin: 14px 0;
        }
      </style>
      <div class="editor">
        <div class="tabs">
          <button class="tab-btn ${tab === "stations" ? "active" : ""}" data-tab="stations">🚏 Stations</button>
          <button class="tab-btn ${tab === "appearance" ? "active" : ""}" data-tab="appearance">🎨 Appearance</button>
          <button class="tab-btn ${tab === "colors" ? "active" : ""}" data-tab="colors">🎨 Line Colors</button>
          <button class="tab-btn ${tab === "advanced" ? "active" : ""}" data-tab="advanced">⚙️ Advanced</button>
        </div>
        <div class="tab-content">
          ${tab === "stations" ? this._renderStationsTab() : ""}
          ${tab === "appearance" ? this._renderAppearanceTab() : ""}
          ${tab === "colors" ? this._renderColorsTab() : ""}
          ${tab === "advanced" ? this._renderAdvancedTab() : ""}
        </div>
      </div>
    `;

    this._attachListeners();
  }

  _renderStationsTab() {
    const entityMap = this._cfg("entity_map", {});
    const entries = Object.entries(entityMap);
    const defaultStation = this._cfg("default_station", entries[0]?.[0] || "");
    const selectorType = this._cfg("station_selector", "buttons");

    const stationRows = entries.map(([name, entity], i) => `
      <div class="station-item" data-idx="${i}">
        <input type="text" class="station-name" data-idx="${i}" placeholder="Station name" value="${this._esc(name)}">
        <input type="text" class="station-entity" data-idx="${i}" placeholder="sensor.tursib_..." value="${this._esc(entity)}">
        <button class="remove-btn" data-remove="${i}" title="Remove">✕</button>
      </div>
    `).join("");

    return `
      <div class="section-title">Station entities</div>
      <p class="hint">Map each station name to its sensor entity. The sensor must have a <code>departures</code> attribute.</p>
      <div class="station-list" id="stationList">
        ${stationRows}
      </div>
      <button class="add-btn secondary" id="addStation">+ Add station</button>

      <hr class="divider-line">

      <div class="section-title">Default station</div>
      <div class="field-row">
        <label class="field-label">Shown on load</label>
        <select class="wide" id="defaultStation">
          ${entries.map(([name]) => `<option value="${this._esc(name)}" ${name === defaultStation ? "selected" : ""}>${name}</option>`).join("")}
        </select>
      </div>

      <div class="section-title">Station selector style</div>
      <div class="field-row">
        <label class="field-label">Selector type</label>
        <select class="wide" id="stationSelector">
          <option value="buttons" ${selectorType === "buttons" ? "selected" : ""}>◀ Buttons ▶</option>
          <option value="dropdown" ${selectorType === "dropdown" ? "selected" : ""}>Dropdown ▼</option>
        </select>
      </div>
    `;
  }

  _renderAppearanceTab() {
    const layoutMode   = this._cfg("layout_mode", "fluid");
    const cardBg       = this._cfg("card_background", "");
    const cardRadius   = this._cfg("card_radius", "12px");
    const cardHeight   = this._cfg("card_height", "auto");
    const cardWidth    = this._cfg("card_width", "100%");
    const stationColor = this._cfg("station_label_color", "#ffffff");
    const destSize     = this._cfg("destination_font_size", "12px");
    const depSize      = this._cfg("departure_font_size", "12px");
    const minSize      = this._cfg("minutes_font_size", "14px");
    const showHeader   = this._cfg("show_header", true);
    const showTime     = this._cfg("show_current_time", true);
    const maxDep       = this._cfg("max_departures", 8);

    return `
      <div class="section-title">Layout</div>
      <div class="field-row">
        <label class="field-label">Layout mode
          <span class="field-sub">Fluid fills container width</span>
        </label>
        <select class="wide" id="layoutMode">
          <option value="fluid" ${layoutMode === "fluid" ? "selected" : ""}>Fluid (responsive)</option>
          <option value="fixed" ${layoutMode === "fixed" ? "selected" : ""}>Fixed (manual size)</option>
        </select>
      </div>
      <div class="field-row">
        <label class="field-label">Card width
          <span class="field-sub">e.g. 400px or 100%</span>
        </label>
        <input type="text" class="wide" id="cardWidth" value="${this._esc(cardWidth)}">
      </div>
      <div class="field-row">
        <label class="field-label">Card height
          <span class="field-sub">auto or e.g. 300px</span>
        </label>
        <input type="text" class="wide" id="cardHeight" value="${this._esc(cardHeight)}">
      </div>
      <div class="field-row">
        <label class="field-label">Max departures shown</label>
        <input type="number" class="narrow" id="maxDepartures" min="1" max="30" value="${maxDep}">
      </div>

      <hr class="divider-line">
      <div class="section-title">Card style</div>
      <div class="field-row">
        <label class="field-label">Background color
          <span class="field-sub">Leave blank to use HA theme</span>
        </label>
        <input type="text" class="wide" id="cardBackground" value="${this._esc(cardBg)}" placeholder="e.g. #1c1c1e">
      </div>
      <div class="field-row">
        <label class="field-label">Border radius
          <span class="field-sub">e.g. 12px</span>
        </label>
        <input type="text" class="narrow" id="cardRadius" value="${this._esc(cardRadius)}">
      </div>

      <hr class="divider-line">
      <div class="section-title">Header</div>
      <div class="toggle-row">
        <label class="field-label">Show header</label>
        <ha-switch id="showHeader" ${showHeader ? "checked" : ""}></ha-switch>
      </div>
      <div class="toggle-row">
        <label class="field-label">Show current time</label>
        <ha-switch id="showTime" ${showTime ? "checked" : ""}></ha-switch>
      </div>
      <div class="field-row">
        <label class="field-label">Station label color</label>
        <input type="color" id="stationColor" value="${this._toHex(stationColor)}">
      </div>

      <hr class="divider-line">
      <div class="section-title">Font sizes</div>
      <div class="field-row">
        <label class="field-label">Destination</label>
        <input type="text" class="narrow" id="destSize" value="${this._esc(destSize)}">
      </div>
      <div class="field-row">
        <label class="field-label">Departure time</label>
        <input type="text" class="narrow" id="depSize" value="${this._esc(depSize)}">
      </div>
      <div class="field-row">
        <label class="field-label">Minutes</label>
        <input type="text" class="narrow" id="minSize" value="${this._esc(minSize)}">
      </div>
    `;
  }

  _renderColorsTab() {
    const colors = this._cfg("colors", {});
    const entries = Object.entries(colors);

    const colorRows = entries.map(([line, color], i) => `
      <div class="color-item" data-idx="${i}">
        <input type="text" class="color-line" data-idx="${i}" placeholder="Line" value="${this._esc(line)}" style="text-align:center;font-weight:700;">
        <input type="color" class="color-value" data-idx="${i}" value="${this._toHex(color)}">
        <button class="remove-btn" data-remove-color="${i}" title="Remove">✕</button>
      </div>
    `).join("");

    return `
      <div class="section-title">Line badge colors</div>
      <p class="hint">Assign a color to each bus line number. Lines not listed will use the default green.</p>
      <div class="color-list" id="colorList">
        ${colorRows}
      </div>
      <button class="add-btn secondary" id="addColor">+ Add line color</button>
    `;
  }

  _renderAdvancedTab() {
    const warnYellow = this._cfg("warn_minutes_yellow", 5);
    const warnRed    = this._cfg("warn_minutes_red", 2);
    const badgeWidth = this._cfg("badge_width", "2.6em");
    const divColor   = this._cfg("divider_color", "");

    return `
      <div class="section-title">Warning thresholds</div>
      <p class="hint">Minutes remaining before color changes. Red is shown when a bus is about to leave.</p>
      <div class="field-row">
        <label class="field-label">🟡 Yellow warning (min)</label>
        <input type="number" class="narrow" id="warnYellow" min="1" max="30" value="${warnYellow}">
      </div>
      <div class="field-row">
        <label class="field-label">🔴 Red warning (min)</label>
        <input type="number" class="narrow" id="warnRed" min="0" max="10" value="${warnRed}">
      </div>

      <hr class="divider-line">
      <div class="section-title">Row style</div>
      <div class="field-row">
        <label class="field-label">Badge width
          <span class="field-sub">e.g. 2.6em or 40px</span>
        </label>
        <input type="text" class="narrow" id="badgeWidth" value="${this._esc(badgeWidth)}">
      </div>
      <div class="field-row">
        <label class="field-label">Divider color
          <span class="field-sub">Leave blank for theme default</span>
        </label>
        <input type="text" class="wide" id="dividerColor" value="${this._esc(divColor)}" placeholder="rgba(255,255,255,0.12)">
      </div>
    `;
  }

  _attachListeners() {
    // Tab switching
    this.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this._activeTab = btn.dataset.tab;
        this._render();
      });
    });

    if (this._activeTab === "stations") {
      // Station name/entity inputs
      this.querySelectorAll(".station-name, .station-entity").forEach(input => {
        input.addEventListener("change", () => this._saveStations());
      });
      // Remove station
      this.querySelectorAll("[data-remove]").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.remove);
          const entries = Object.entries(this._cfg("entity_map", {}));
          entries.splice(idx, 1);
          this._set("entity_map", Object.fromEntries(entries));
          this._render();
        });
      });
      // Add station
      this.querySelector("#addStation")?.addEventListener("click", () => {
        const map = { ...this._cfg("entity_map", {}), [`Station ${Object.keys(this._cfg("entity_map", {})).length + 1}`]: "" };
        this._set("entity_map", map);
        this._render();
      });
      // Default station
      this.querySelector("#defaultStation")?.addEventListener("change", e => {
        this._set("default_station", e.target.value);
      });
      // Selector type
      this.querySelector("#stationSelector")?.addEventListener("change", e => {
        this._set("station_selector", e.target.value);
      });
    }

    if (this._activeTab === "appearance") {
      const binds = [
        ["#layoutMode",     "layout_mode",           "value"],
        ["#cardWidth",      "card_width",             "value"],
        ["#cardHeight",     "card_height",            "value"],
        ["#maxDepartures",  "max_departures",         "number"],
        ["#cardBackground", "card_background",        "value"],
        ["#cardRadius",     "card_radius",            "value"],
        ["#stationColor",   "station_label_color",    "value"],
        ["#destSize",       "destination_font_size",  "value"],
        ["#depSize",        "departure_font_size",    "value"],
        ["#minSize",        "minutes_font_size",      "value"],
      ];
      binds.forEach(([sel, key, type]) => {
        const el = this.querySelector(sel);
        if (!el) return;
        el.addEventListener("change", e => {
          this._set(key, type === "number" ? parseInt(e.target.value) : e.target.value);
        });
      });
      // Toggles
      this.querySelector("#showHeader")?.addEventListener("change", e => this._set("show_header", e.target.checked));
      this.querySelector("#showTime")?.addEventListener("change", e => this._set("show_current_time", e.target.checked));
    }

    if (this._activeTab === "colors") {
      this.querySelectorAll(".color-line, .color-value").forEach(input => {
        input.addEventListener("change", () => this._saveColors());
      });
      this.querySelectorAll("[data-remove-color]").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.removeColor);
          const entries = Object.entries(this._cfg("colors", {}));
          entries.splice(idx, 1);
          this._set("colors", Object.fromEntries(entries));
          this._render();
        });
      });
      this.querySelector("#addColor")?.addEventListener("click", () => {
        const colors = { ...this._cfg("colors", {}), "": "#007b00" };
        this._set("colors", colors);
        this._render();
      });
    }

    if (this._activeTab === "advanced") {
      const binds = [
        ["#warnYellow",   "warn_minutes_yellow", "number"],
        ["#warnRed",      "warn_minutes_red",    "number"],
        ["#badgeWidth",   "badge_width",         "value"],
        ["#dividerColor", "divider_color",       "value"],
      ];
      binds.forEach(([sel, key, type]) => {
        const el = this.querySelector(sel);
        if (!el) return;
        el.addEventListener("change", e => {
          this._set(key, type === "number" ? parseInt(e.target.value) : e.target.value);
        });
      });
    }
  }

  _saveStations() {
    const items = this.querySelectorAll(".station-item");
    const map = {};
    items.forEach(item => {
      const name   = item.querySelector(".station-name")?.value?.trim();
      const entity = item.querySelector(".station-entity")?.value?.trim();
      if (name) map[name] = entity || "";
    });
    this._config = { ...this._config, entity_map: map };
    this._fireConfigChanged();
    // Refresh default_station dropdown
    const defSel = this.querySelector("#defaultStation");
    if (defSel) {
      const keys = Object.keys(map);
      defSel.innerHTML = keys.map(k =>
        `<option value="${this._esc(k)}" ${k === this._config.default_station ? "selected" : ""}>${k}</option>`
      ).join("");
    }
  }

  _saveColors() {
    const items = this.querySelectorAll(".color-item");
    const colors = {};
    items.forEach(item => {
      const line  = item.querySelector(".color-line")?.value?.trim();
      const color = item.querySelector(".color-value")?.value;
      if (line) colors[line] = color || "#007b00";
    });
    this._config = { ...this._config, colors };
    this._fireConfigChanged();
  }

  _toHex(color) {
    if (!color) return "#ffffff";
    if (color.startsWith("#") && (color.length === 7 || color.length === 4)) return color;
    // Return safe fallback for CSS variables or named colors
    return "#ffffff";
  }

  _esc(val) {
    if (!val) return "";
    return String(val).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

customElements.define("tursib-card-editor", TursibCardEditor);