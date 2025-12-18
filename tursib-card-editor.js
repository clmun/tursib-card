class TursibCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }

  _render() {
    if (!this._config) return;

    this.shadowRoot.innerHTML = `
      <style>
        .card-config { padding: 8px; }
        ha-textfield, ha-entity-picker { display: block; margin-bottom: 16px; }
        ha-formfield { display: flex; align-items: center; }
      </style>
      <div class="card-config">
        <ha-entity-picker
          .label="Senzor Tursib (Entity)"
          .hass=${this._hass}
          .value=${this._config.entity}
          .includeDomains=${["sensor"]}
          @value-changed=${this._valueChanged}
          data-config="entity"
        ></ha-entity-picker>

        <ha-textfield
          label="Titlu Card"
          .value=${this._config.title || ""}
          @input=${this._valueChanged}
          data-config="title"
        ></ha-textfield>

        <ha-formfield label="Afișează Destinația">
          <ha-switch
            .checked=${this._config.show_destination !== false}
            @change=${this._valueChanged}
            data-config="show_destination"
          ></ha-switch>
        </ha-formfield>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this._hass) return;
    
    const target = ev.target;
    const configKey = target.getAttribute("data-config");
    
    let newValue;
    if (target.tagName === 'HA-SWITCH') {
        newValue = target.checked;
    } else if (ev.detail && ev.detail.value) {
        newValue = ev.detail.value;
    } else {
        newValue = target.value;
    }

    const newConfig = { ...this._config, [configKey]: newValue };

    // ACESTA ESTE PASUL CRITIC: Notifică HA că s-a schimbat configurația
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define("tursib-card-editor", TursibCardEditor);

// Notifică HA că editorul este disponibil
window.customCards = window.customCards || [];
window.customCards.push({
  type: "tursib-card",
  name: "Tursib Transport Card",
  preview: true,
  description: "Card pentru monitorizarea autobuzelor Tursib Sibiu"
});