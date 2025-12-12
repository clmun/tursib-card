import { LitElement, html } from "lit";

class TursibCardEditor extends LitElement {
  private _config: any = {};

  setConfig(config: any) {
    this._config = { ...config };
  }

  get config() {
    return this._config;
  }

  render() {
    if (!this._config) return html``;

    return html`
      <div class="form">
        <!-- Station selector -->
        <label>Station selector</label>
        <select @change=${(e: any) => this._update("station_selector", e.target.value)}>
          <option value="dropdown" ?selected=${this._config.station_selector === "dropdown"}>Dropdown</option>
          <option value="buttons" ?selected=${this._config.station_selector === "buttons"}>Buttons</option>
        </select>

        <!-- Layout mode -->
        <label>Layout mode</label>
        <select @change=${(e: any) => this._update("layout_mode", e.target.value)}>
          <option value="fixed" ?selected=${this._config.layout_mode === "fixed"}>Fixed</option>
          <option value="fluid" ?selected=${this._config.layout_mode === "fluid"}>Fluid</option>
        </select>

        <!-- Background color -->
        <label>Background color</label>
        <input type="color"
               .value=${this._config.card_background || "#f9f9f9"}
               @input=${(e: any) => this._update("card_background", e.target.value)} />

        <!-- Border radius -->
        <label>Border radius (px)</label>
        <input type="number"
               .value=${this._config.card_radius || 12}
               @input=${(e: any) => this._update("card_radius", e.target.value)} />

        <!-- Font family -->
        <label>Font family</label>
        <input type="text"
               .value=${this._config.font_family || "sans-serif"}
               @input=${(e: any) => this._update("font_family", e.target.value)} />
      </div>
    `;
  }

  private _update(key: string, value: any) {
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define("tursib-card-editor", TursibCardEditor);
