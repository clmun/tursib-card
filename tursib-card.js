/**
 * TURSIB Sibiu Card - Versiune Completă & Stabilă
 * Facilități: Editor UI, Culori Custom, Limitare Linii, Afișare/Ascundere Ceas, Fundal Custom.
 */

window.customCards = window.customCards || [];
window.customCards.push({
  type: "tursib-card",
  name: "Tursib Sibiu Pro",
  description: "Afișează timpii de așteptare Tursib cu personalizare vizuală.",
  preview: true
});

// --- 1. EDITORUL (Logica de configurare) ---
class TursibCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (!this._config) return;

    this.innerHTML = `
      <div style="padding: 10px; display: flex; flex-direction: column; gap: 15px;">
        <ha-textfield label="Titlu Card" .value="${this._config.title || ""}" .configValue="${"title"}" @input="${this._valueChanged}"></ha-textfield>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <ha-select label="Selector Stație" .value="${this._config.station_selector || "dropdown"}" .configValue="${"station_selector"}" @selected="${this._valueChanged}" @change="${this._valueChanged}">
            <mwc-list-item value="dropdown">Listă (Dropdown)</mwc-list-item>
            <mwc-list-item value="buttons">Butoane (◀ ▶)</mwc-list-item>
          </ha-select>
          <ha-textfield label="Nr. Linii" type="number" .value="${this._config.max_lines || 10}" .configValue="${"max_lines"}" @input="${this._valueChanged}"></ha-textfield>
        </div>

        <ha-textfield label="Culoare Fundal (ex: #2c3e50)" .value="${this._config.background_color || ""}" .configValue="${"background_color"}" @input="${this._valueChanged}"></ha-textfield>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px;">
          <span>Afișează Ceasul</span>
          <ha-switch .checked="${this._config.show_clock !== false}" .configValue="${"show_clock"}" @change="${this._valueChanged}"></ha-switch>
        </div>

        <ha-textarea label="Culori Linii (JSON: {'11': 'red'})" .value='${JSON.stringify(this._config.colors || {})}' .configValue="${"colors"}" @input="${this._valueChanged}" rows="2"></ha-textarea>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this._hass) return;
    const target = ev.target;
    const configValue = target.configValue;
    let newValue = target.tagName === 'HA-SWITCH' ? target.checked : target.value;

    if (configValue === "colors") { try { newValue = JSON.parse(newValue); } catch (e) { return; } }
    if (configValue === "max_lines") newValue = parseInt(newValue) || 10;

    // Blocăm "Enter" să nu închidă fereastra prematur
    if (ev.type === 'keydown' && ev.key === 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();
    }

    const event = new CustomEvent("config-changed", {
      detail: { config: { ...this._config, [configValue]: newValue } },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}
customElements.define("tursib-card-editor", TursibCardEditor);

// --- 2. CARDUL (Logica de afișare) ---
class TursibCard extends HTMLElement {
  constructor() {
    super();
    this._selectedStation = null;
  }

  static getConfigElement() { return document.createElement("tursib-card-editor"); }

  static getStubConfig() {
    return { title: "Tursib", station_selector: "dropdown", max_lines: 5, show_clock: true };
  }

  setConfig(config) {
    this._config = { show_clock: true, max_lines: 10, ...config };
    if (!this._selectedStation && this._config.entity_map) {
      this._selectedStation = Object.keys(this._config.entity_map)[0];
    }
    if (this._hass) this._updateUI();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateUI();
  }

  _updateUI() {
    if (!this._hass || !this._config) return;
    const entityMap = this._config.entity_map || {};
    const options = Object.keys(entityMap);

    if (options.length === 0) {
      this.innerHTML = `<ha-card style="padding:16px;">Setați <b>entity_map</b> în YAML.</ha-card>`;
      return;
    }

    const currentStation = this._selectedStation || options[0];
    const stateObj = this._hass.states[entityMap[currentStation]];

    if (!stateObj) {
      this.innerHTML = `<ha-card style="padding:16px;">Senzor negăsit: ${entityMap[currentStation]}</ha-card>`;
      return;
    }

    this._render(stateObj, options, currentStation);
  }

  _render(stateObj, options, currentStation) {
    let departures = stateObj.attributes.departures || [];
    if (this._config.max_lines) departures = departures.slice(0, this._config.max_lines);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const bg = this._config.background_color ? `background: ${this._config.background_color} !important;` : "";

    this.innerHTML = `
      <style>
        .t-card { padding: 16px; ${bg} border-radius: var(--ha-card-border-radius, 12px); }
        .t-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .t-row { display: grid; grid-template-columns: 50px 1fr 75px 55px; gap: 8px; margin-bottom: 8px; align-items: center; }
        .t-badge { color: white; padding: 2px 5px; border-radius: 4px; font-weight: bold; text-align: center; font-size: 0.9em; }
        .nav-btn { cursor: pointer; border: 1px solid var(--divider-color); background: var(--secondary-background-color); color: var(--primary-text-color); padding: 2px 8px; border-radius: 4px; }
      </style>
      <ha-card class="t-card">
        ${this._config.title ? `<div style="font-size:1.2em; font-weight:bold; margin-bottom:10px;">${this._config.title}</div>` : ""}
        <div class="t-header">
          ${this._config.station_selector === 'buttons' ?
            `<div><button id="p" class="nav-btn">◀</button> <span style="font-weight:bold; padding:0 5px;">${currentStation}</span> <button id="n" class="nav-btn">▶</button></div>` :
            `<select id="s" style="padding:4px; border-radius:4px; background:var(--card-background-color); color:var(--primary-text-color);">${options.map(o => `<option value="${o}" ${o === currentStation ? 'selected' : ''}>${o}</option>`).join('')}</select>`
          }
          ${this._config.show_clock !== false ? `<span style="opacity:0.8;">${now}</span>` : ""}
        </div>
        <div style="height:2px; background:#255393; margin-bottom:12px;"></div>
        <div>
          ${departures.map(d => {
            const lineCol = (this._config.colors && this._config.colors[d.line]) || "#007b00";
            return `
              <div class="t-row">
                <div class="t-badge" style="background: ${lineCol}">${d.line}</div>
                <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:0.9em;">${d.destination}</div>
                <div style="font-weight:bold; text-align:right; color:var(--primary-color);">${d.minutes} min</div>
                <div style="opacity:0.7; text-align:right; font-size:0.8em;">${d.departure}</div>
              </div>`;
          }).join('')}
        </div>
      </ha-card>
    `;

    // Event Listeners
    const s = this.querySelector("#s");
    if (s) s.onchange = (e) => { this._selectedStation = e.target.value; this._updateUI(); };
    const p = this.querySelector("#p");
    if (p) p.onclick = () => { const i = options.indexOf(this._selectedStation); this._selectedStation = options[(i - 1 + options.length) % options.length]; this._updateUI(); };
    const n = this.querySelector("#n");
    if (n) n.onclick = () => { const i = options.indexOf(this._selectedStation); this._selectedStation = options[(i + 1) % options.length]; this._updateUI(); };
  }
}
customElements.define("tursib-card", TursibCard);