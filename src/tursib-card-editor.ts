import { LitElement, html } from "lit";

class TursibCardEditor extends LitElement {
  private _config: any = {};

  setConfig(config: any) {
    this._config = { ...config };
  }

  render() {
    if (!this._config) return html``;

    return html`
      <div class="form">
        <label>Default station</label>
        <input type="text"
               .value=${this._config.default_station || ""}
               @input=${(e: any) => this._update("default_station", e.target.value)} />

        <label>Layout mode</label>
        <select @change=${(e: any) => this._update("layout_mode", e.target.value)}>
          <option value="fixed" ?selected=${this._config.layout_mode === "fixed"}>Fixed</option>
          <option value="fluid" ?selected=${this._config.layout_mode === "fluid"}>Fluid</option>
        </select>

        <label>Station selector</label>
        <select @change=${(e: any) => this._update("station_selector", e.target.value)}>
          <option value="dropdown" ?selected=${this._config.station_selector === "dropdown"}>Dropdown</option>
          <option value="buttons" ?selected=${this._config.station_selector === "buttons"}>Buttons</option>
        </select>

        <label>Station label color</label>
        <input type="color"
               .value=${this._config.station_label_color || "#0044cc"}
               @input=${(e: any) => this._update("station_label_color", e.target.value)} />

        <label>Card width</label>
        <input type="text"
               .value=${this._config.card_width || "480px"}
               @input=${(e: any) => this._update("card_width", e.target.value)} />

        <label>Badge width</label>
        <input type="text"
               .value=${this._config.badge_width || "3em"}
               @input=${(e: any) => this._update("badge_width", e.target.value)} />

        <label>Destination width</label>
        <input type="text"
               .value=${this._config.destination_width || "300px"}
               @input=${(e: any) => this._update("destination_width", e.target.value)} />

        <label>Destination font size</label>
        <input type="text"
               .value=${this._config.destination_font_size || "10px"}
               @input=${(e: any) => this._update("destination_font_size", e.target.value)} />

        <label>Departure font size</label>
        <input type="text"
               .value=${this._config.departure_font_size || "10px"}
               @input=${(e: any) => this._update("departure_font_size", e.target.value)} />

        <label>Minutes font size</label>
        <input type="text"
               .value=${this._config.minutes_font_size || "12px"}
               @input=${(e: any) => this._update("minutes_font_size", e.target.value)} />

        <label>Minutes color</label>
        <input type="color"
               .value=${this._config.minutes_color || "green"}
               @input=${(e: any) => this._update("minutes_color", e.target.value)} />

        <label>Divider thickness</label>
        <input type="text"
               .value=${this._config.divider_thickness || "2px"}
               @input=${(e: any) => this._update("divider_thickness", e.target.value)} />
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
