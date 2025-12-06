class TursibCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  connectedCallback() {
    this.innerHTML = `
      <div>
        <label>Senzor stație:</label>
        <input id="entity" type="text" value="${this._config.entity || ""}">
        <br><br>
        <label>Paleta culori (JSON):</label>
        <textarea id="colors" rows="6" cols="40">${JSON.stringify(this._config.colors || {}, null, 2)}</textarea>
      </div>
    `;
    this.querySelector("#entity").addEventListener("change", ev => {
      this._config.entity = ev.target.value;
      this._updateConfig();
    });
    this.querySelector("#colors").addEventListener("change", ev => {
      try {
        this._config.colors = JSON.parse(ev.target.value);
        this._updateConfig();
      } catch (e) {
        console.error("Invalid JSON for colors");
      }
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
