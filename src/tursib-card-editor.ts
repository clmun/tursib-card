import { LitElement, html } from "lit";

class TursibCardEditor extends LitElement {
  private _config: any = null;

  setConfig(config: any) {
    this._config = { ...config };
  }

  get config() {
    return this._config;
  }

  render() {
    if (!this._config) return html``;
    return html`
      <div>
        <label>Station selector</label>
        <select @change=${this._stationSelectorChanged}>
          <option
            value="dropdown"
            ?selected=${this._config.station_selector === "dropdown"}
          >
            Dropdown
          </option>
          <option
            value="buttons"
            ?selected=${this._config.station_selector === "buttons"}
          >
            Buttons
          </option>
        </select>
      </div>

      <div>
        <label>Layout mode</label>
        <select @change=${this._layoutModeChanged}>
          <option
            value="fixed"
            ?selected=${this._config.layout_mode === "fixed"}
          >
            Fixed
          </option>
          <option
            value="fluid"
            ?selected=${this._config.layout_mode === "fluid"}
          >
            Fluid
          </option>
        </select>
      </div>
    `;
  }

  private _stationSelectorChanged(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this._config = { ...this._config, station_selector: value };
    this._updateConfig();
  }

  private _layoutModeChanged(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this._config = { ...this._config, layout_mode: value };
    this._updateConfig();
  }

  private _updateConfig() {
    const ev = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(ev);
  }
}

// Important: înregistrăm fără export
customElements.define("tursib-card-editor", TursibCardEditor);
