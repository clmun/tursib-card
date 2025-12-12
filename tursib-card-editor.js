class TursibCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  render() {
    this.innerHTML = `
      <div>
        <label>Station selector</label>
        <select id="station_selector">
          <option value="dropdown" ${this._config.station_selector === "dropdown" ? "selected" : ""}>Dropdown</option>
          <option value="buttons" ${this._config.station_selector === "buttons" ? "selected" : ""}>Buttons</option>
        </select>
      </div>
      <div>
        <label>Layout mode</label>
        <select id="layout_mode">
          <option value="fixed" ${this._config.layout_mode === "fixed" ? "selected" : ""}>Fixed</option>
          <option value="fluid" ${this._config.layout_mode === "fluid" ? "selected" : ""}>Fluid</option>
        </select>
      </div>
      <div>
        <label>Background</label>
        <input id="card_background" type="text" value="${this._config.card_background || "#f9f9f9"}">
      </div>
      <div>
        <label>Radius</label>
        <input id="card_radius" type="text" value="${this._config.card_radius || "12px"}">
      </div>
    `;

    this.querySelector("#station_selector").addEventListener("change", e => {
      this._config.station_selector = e.target.value;
      this._updateConfig();
    });

    this.querySelector("#layout_mode").addEventListener("change", e => {
      this._config.layout_mode = e.target.value;
      this._updateConfig();
    });

    this.querySelector("#card_background").addEventListener("input", e => {
      this._config.card_background = e.target.value;
      this._updateConfig();
    });

    this.querySelector("#card_radius").addEventListener("input", e => {
      this._config.card_radius = e.target.value;
      this._updateConfig();
    });
  }

  _updateConfig() {
    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define("tursib-card-editor", TursibCardEditor);
