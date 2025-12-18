/**
 * Tursib Card - Sibiu
 * Versiune cu Editor UI Forțat
 */

console.info("%c TURSIB-CARD %c Versiune 1.0.5 ", "color: white; background: #255393; font-weight: 700;", "color: #255393; background: white; font-weight: 700;");

// 1. Înregistrarea pentru Picker-ul vizual
window.customCards = window.customCards || [];
window.customCards.push({
  type: "tursib-card",
  name: "Tursib Sibiu Card",
  description: "Afișează plecările Tursib Sibiu.",
  preview: true
});

// 2. CLASA EDITOR (Configurație UI)
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

    // Folosim un template literal curat
    this.innerHTML = `
      <div id="editor-container" style="padding: 10px; display: flex; flex-direction: column; gap: 20px;">
        <div class="field">
          <label style="display: block; margin-bottom: 5px;">Titlu Card</label>
          <ha-textfield
            .label="${"Titlu"}"
            .value="${this._config.title || ""}"
            .configValue="${"title"}"
            @input="${this._valueChanged}"
            style="width: 100%;"
          ></ha-textfield>
        </div>

        <div class="field">
          <label style="display: block; margin-bottom: 5px;">Selector Stație</label>
          <ha-select
            fixedMenuPosition
            naturalMenuWidth
            .label="${"Tip Selector"}"
            .value="${this._config.station_selector || "dropdown"}"
            .configValue="${"station_selector"}"
            @selected="${this._valueChanged}"
            style="width: 100%;"
          >
            <mwc-list-item value="dropdown">Listă derulantă (Dropdown)</mwc-list-item>
            <mwc-list-item value="buttons">Săgeți (◀ ▶)</mwc-list-item>
          </ha-select>
        </div>

        <div class="field" style="background: #f0f0f0; padding: 10px; border-radius: 4px; color: #444; font-size: 13px;">
          <strong>Notă:</strong> Stațiile (entity_map) se editează momentan doar în <strong>Code Editor (YAML)</strong>.
        </div>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this._hass) return;
    const target = ev.target;
    const configValue = target.configValue;
    let newValue = target.value;

    if (this._config[configValue] === newValue) return;

    const newConfig = {
      ...this._config,
      [configValue]: newValue
    };

    // Evenimentul CRITIC care salvează datele în HA
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}
customElements.define("tursib-card-editor", TursibCardEditor);

// 3. CLASA CARDULUI PRINCIPAL
class TursibCard extends HTMLElement {
  constructor() {
    super();
    this._selectedStation = null;
  }

  static getConfigElement() {
    return document.createElement("tursib-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Tursib",
      station_selector: "dropdown",
      entity_map: { "Stație": "sensor.tursib_aumovio" }
    };
  }

  setConfig(config) {
    this._config = config;
    if (!this._selectedStation && config.entity_map) {
      this._selectedStation = config.default_station || Object.keys(config.entity_map)[0];
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;

    const entityMap = this._config.entity_map || {};
    const options = Object.keys(entityMap);
    const currentStation = this._selectedStation || options[0];
    const entityId = entityMap[currentStation];
    const stateObj = hass.states[entityId];

    if (!stateObj) {
      this.innerHTML = `<ha-card style="padding:16px;">Entitate negăsită: ${entityId}</ha-card>`;
      return;
    }

    this._render(stateObj, options, currentStation);
  }

  _render(stateObj, options, currentStation) {
    const departures = stateObj.attributes.departures || [];
    const title = this._config.title || "Tursib";
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    this.innerHTML = `
      <style>
        .t-card { padding: 16px; }
        .t-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .t-divider { height: 2px; background: #255393; margin-bottom: 10px; }
        .t-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .t-badge { background: #007b00; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; width: 40px; text-align: center; }
        .t-dest { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .t-min { font-weight: bold; }
        select { padding: 4px; border-radius: 4px; }
      </style>
      <ha-card class="t-card">
        <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">${title}</div>
        <div class="t-header">
          ${this._config.station_selector === 'buttons' ?
            `<div><button id="p">◀</button> <b>${currentStation}</b> <button id="n">▶</button></div>` :
            `<select id="s">${options.map(o => `<option value="${o}" ${o === currentStation ? 'selected' : ''}>${o}</option>`).join('')}</select>`
          }
          <span>${now}</span>
        </div>
        <div class="t-divider"></div>
        ${departures.map(d => `
          <div class="t-row">
            <div class="t-badge">${d.line}</div>
            <div class="t-dest">${d.destination}</div>
            <div class="t-min">${d.minutes} min</div>
          </div>
        `).join('')}
      </ha-card>
    `;

    // Event Listeners
    const s = this.querySelector("#s");
    if (s) s.onchange = (e) => { this._selectedStation = e.target.value; this.hass = this._hass; };
    const p = this.querySelector("#p");
    if (p) p.onclick = () => {
        const i = options.indexOf(this._selectedStation);
        this._selectedStation = options[(i - 1 + options.length) % options.length];
        this.hass = this._hass;
    };
    const n = this.querySelector("#n");
    if (n) n.onclick = () => {
        const i = options.indexOf(this._selectedStation);
        this._selectedStation = options[(i + 1) % options.length];
        this.hass = this._hass;
    };
  }
}
customElements.define("tursib-card", TursibCard);