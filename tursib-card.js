/**
 * Tursib Card Pro - Sibiu
 * Versiune consolidată: Editor + Card într-un singur fișier
 */

window.customCards = window.customCards || [];
window.customCards.push({
  type: "tursib-card",
  name: "Tursib Sibiu Card Pro",
  description: "Card avansat pentru Tursib cu personalizare completă.",
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
      <div style="padding: 10px; display: flex; flex-direction: column; gap: 15px;">
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
          label="Culoare Fundal (ex: #2c3e50 sau transparent)"
          .value="${this._config.background_color || ""}"
          .configValue="${"background_color"}"
          @input="${this._valueChanged}"
          style="width: 100%;"
        ></ha-textfield>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 5px;">
          <span>Afișează Ceasul în colț</span>
          <ha-switch
            .checked="${this._config.show_clock !== false}"
            .configValue="${"show_clock"}"
            @change="${this._valueChanged}"
          ></ha-switch>
        </div>

        <div style="padding: 12px; background: var(--secondary-background-color); border-radius: 8px;">
          <ha-textarea
            label="Culori Linii (Format JSON)"
            .value='${JSON.stringify(this._config.colors || {})}'
            .configValue="${"colors"}"
            @input="${this._valueChanged}"
            style="width: 100%;"
            rows="2"
          ></ha-textarea>
          <p style="font-size: 0.8em; margin-top: 5px; opacity: 0.6; font-style: italic;">Ex: {"11": "orange", "1": "blue"}</p>
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
      newValue = ev.detail.value || target.value;
    } else {
      newValue = target.value;
    }

    if (configValue === "colors") {
      try { newValue = JSON.parse(newValue); } catch (e) { return; }
    }
    if (configValue === "max_lines") newValue = parseInt(newValue) || 10;

    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: { ...this._config, [configValue]: newValue } },
      bubbles: true,
      composed: true,
    }));
  }
}
customElements.define("tursib-card-editor", TursibCardEditor);

// --- 2. CARDUL PRINCIPAL (Afișarea) ---
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
      title: "Tursib Sibiu",
      station_selector: "dropdown",
      max_lines: 5,
      show_clock: true
    };
  }

  setConfig(config) {
    this._config = {
      max_lines: 10,
      show_clock: true,
      ...config
    };

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
      this.innerHTML = `<ha-card style="padding:16px;">Adaugă <b>entity_map</b> în YAML pentru a vedea datele.</ha-card>`;
      return;
    }

    const currentStation = this._selectedStation || options[0];
    const entityId = entityMap[currentStation];
    const stateObj = this._hass.states[entityId];

    if (!stateObj) {
      this.innerHTML = `<ha-card style="padding:16px;">Eroare: Entitatea <b>${entityId}</b> nu a fost găsită.</ha-card>`;
      return;
    }

    this._render(stateObj, options, currentStation);
  }

  _render(stateObj, options, currentStation) {
    let departures = stateObj.attributes.departures || [];
    if (this._config.max_lines) departures = departures.slice(0, this._config.max_lines);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const bgStyle = this._config.background_color ? `background: ${this._config.background_color} !important;` : "";

    this.innerHTML = `
      <style>
        .t-card { padding: 16px; ${bgStyle} border-radius: var(--ha-card-border-radius, 12px); }
        .t-title { font-size: 1.2em; font-weight: bold; margin-bottom: 12px; }
        .t-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .t-divider { height: 2px; background: #255393; margin-bottom: 12px; }
        .t-row { display: grid; grid-template-columns: 50px 1fr 75px 55px; gap: 8px; margin-bottom: 10px; align-items: center; }
        .t-badge { color: white; padding: 2px 5px; border-radius: 4px; font-weight: bold; text-align: center; font-size: 0.85em; }
        .t-dest { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.9em; }
        .t-min { font-weight: bold; text-align: right; }
        .t-time { opacity: 0.7; text-align: right; font-size: 0.8em; }
        .btn-nav { cursor: pointer; border: 1px solid var(--divider-color); background: var(--secondary-background-color); color: var(--primary-text-color); padding: 4px 10px; border-radius: 4px; }
        .t-select { padding: 5px; border-radius: 4px; background: var(--card-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); font-size: 14px; }
      </style>
      <ha-card class="t-card">
        ${this._config.title ? `<div class="t-title">${this._config.title}</div>` : ""}
        <div class="t-header">
          ${this._config.station_selector === 'buttons' ?
            `<div><button id="p" class="btn-nav">◀</button> <span style="font-weight:bold; padding: 0 5px;">${currentStation}</span> <button id="n" class="btn-nav">▶</button></div>` :
            `<select id="s" class="t-select">${options.map(o => `<option value="${o}" ${o === currentStation ? 'selected' : ''}>${o}</option>`).join('')}</select>`
          }
          ${this._config.show_clock !== false ? `<span style="font-size: 0.9em; opacity: 0.8;">${now}</span>` : ""}
        </div>
        <div class="t-divider"></div>
        <div class="t-list">
          ${departures.map(d => {
            const lineCol = (this._config.colors && this._config.colors[d.line]) || "#007b00";
            const minCol = d.minutes === 'Acum' ? '#e74c3c' : 'var(--primary-color)';
            return `
              <div class="t-row">
                <div class="t-badge" style="background: ${lineCol}">${d.line}</div>
                <div class="t-dest" title="${d.destination}">${d.destination}</div>
                <div class="t-min" style="color: ${minCol}">${d.minutes}${d.minutes === 'Acum' ? '' : ' min'}</div>
                <div class="t-time">${d.departure}</div>
              </div>`;
          }).join('')}
          ${departures.length === 0 ? '<div style="text-align:center; opacity:0.5;">Fără plecări programate</div>' : ''}
        </div>
      </ha-card>
    `;

    this._setupDomEvents(options);
  }

  _setupDomEvents(options) {
    const s = this.querySelector("#s");
    if (s) s.onchange = (e) => { this._selectedStation = e.target.value; this._updateUI(); };

    const p = this.querySelector("#p");
    const n = this.querySelector("#n");
    if (p && n) {
      p.onclick = () => {
        const i = options.indexOf(this._selectedStation);
        this._selectedStation = options[(i - 1 + options.length) % options.length];
        this._updateUI();
      };
      n.onclick = () => {
        const i = options.indexOf(this._selectedStation);
        this._selectedStation = options[(i + 1) % options.length];
        this._updateUI();
      };
    }
  }

  getCardSize() {
    return 3 + (this._config.max_lines / 2);
  }
}
customElements.define("tursib-card", TursibCard);