window.customCards = window.customCards || [];
window.customCards.push({
  type: "tursib-card",
  name: "Tursib Sibiu Card Pro",
  description: "Monitorizare Tursib cu Editor UI funcțional.",
  preview: true
});

// --- 1. EDITORUL (Interfața de Setări) ---
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
      <div class="card-config" style="padding: 10px; display: flex; flex-direction: column; gap: 15px;">
        <ha-textfield
          label="Titlu Card"
          .value="${this._config.title || ""}"
          .configValue="${"title"}"
          @input="${this._valueChanged}"
          style="width: 100%;"
        ></ha-textfield>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <ha-select
            label="Tip Selector"
            .value="${this._config.station_selector || "dropdown"}"
            .configValue="${"station_selector"}"
            @selected="${this._valueChanged}"
            @change="${this._valueChanged}"
            style="width: 100%;"
          >
            <mwc-list-item value="dropdown">Dropdown</mwc-list-item>
            <mwc-list-item value="buttons">Butoane (◀ ▶)</mwc-list-item>
          </ha-select>

          <ha-textfield
            label="Nr. maxim linii"
            type="number"
            .value="${this._config.max_lines || 10}"
            .configValue="${"max_lines"}"
            @input="${this._valueChanged}"
          ></ha-textfield>
        </div>

        <ha-textfield
          label="Fundal (HEX ex: #2c3e50)"
          .value="${this._config.background_color || ""}"
          .configValue="${"background_color"}"
          @input="${this._valueChanged}"
          style="width: 100%;"
        ></ha-textfield>

        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span>Afișează Ceasul</span>
          <ha-switch
            .checked="${this._config.show_clock !== false}"
            .configValue="${"show_clock"}"
            @change="${this._valueChanged}"
          ></ha-switch>
        </div>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this._hass) return;
    const target = ev.target;
    const configValue = target.configValue;

    let newValue;
    if (target.tagName === 'HA-SWITCH') {
      newValue = target.checked;
    } else if (target.tagName === 'HA-SELECT') {
      newValue = target.value;
    } else {
      newValue = target.value;
    }

    if (this._config[configValue] === newValue) return;

    // CREAREA EVENIMENTULUI STANDARD HA
    const newConfig = { ...this._config, [configValue]: newValue };

    const messageEvent = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(messageEvent);
  }
}
customElements.define("tursib-card-editor", TursibCardEditor);

// --- 2. CARDUL PRINCIPAL ---
class TursibCard extends HTMLElement {
  constructor() {
    super();
    this._selectedStation = null;
  }

  static getConfigElement() {
    return document.createElement("tursib-card-editor");
  }

  static getStubConfig() {
    return { title: "Tursib", station_selector: "dropdown", max_lines: 5, show_clock: true };
  }

  setConfig(config) {
    this._config = { show_clock: true, max_lines: 10, ...config };
    if (!this._selectedStation && this._config.entity_map) {
      this._selectedStation = Object.keys(this._config.entity_map)[0];
    }
    this._updateUI();
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
      this.innerHTML = `<ha-card style="padding:16px; text-align:center;">Setați <b>entity_map</b> în Code Editor.</ha-card>`;
      return;
    }

    const currentStation = this._selectedStation || options[0];
    const entityId = entityMap[currentStation];
    const stateObj = this._hass.states[entityId];

    if (!stateObj) {
      this.innerHTML = `<ha-card style="padding:16px;">Entitatea <b>${entityId}</b> negăsită.</ha-card>`;
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
        .t-badge { background: #007b00; color: white; padding: 2px 5px; border-radius: 4px; font-weight: bold; text-align: center; }
      </style>
      <ha-card class="t-card">
        ${this._config.title ? `<div style="font-size:1.2em; font-weight:bold; margin-bottom:10px;">${this._config.title}</div>` : ""}
        <div class="t-header">
          ${this._config.station_selector === 'buttons' ?
            `<div><button id="p">◀</button> <b>${currentStation}</b> <button id="n">▶</button></div>` :
            `<select id="s">${options.map(o => `<option value="${o}" ${o === currentStation ? 'selected' : ''}>${o}</option>`).join('')}</select>`
          }
          ${this._config.show_clock !== false ? `<span>${now}</span>` : ""}
        </div>
        <div style="height:2px; background:#255393; margin-bottom:12px;"></div>
        <div>
          ${departures.map(d => `
            <div class="t-row">
              <div class="t-badge">${d.line}</div>
              <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${d.destination}</div>
              <div style="font-weight:bold; text-align:right;">${d.minutes} min</div>
              <div style="opacity:0.7; text-align:right;">${d.departure}</div>
            </div>
          `).join('')}
        </div>
      </ha-card>
    `;

    const s = this.querySelector("#s");
    if (s) s.onchange = (e) => { this._selectedStation = e.target.value; this._updateUI(); };
    const p = this.querySelector("#p");
    if (p) p.onclick = () => { const i = options.indexOf(this._selectedStation); this._selectedStation = options[(i - 1 + options.length) % options.length]; this._updateUI(); };
    const n = this.querySelector("#n");
    if (n) n.onclick = () => { const i = options.indexOf(this._selectedStation); this._selectedStation = options[(i + 1) % options.length]; this._updateUI(); };
  }

  getCardSize() { return 4; }
}
customElements.define("tursib-card", TursibCard);