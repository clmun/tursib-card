import { LitElement, html, css } from "lit";

type Hass = any;

class TursibCard extends LitElement {
  static styles = css`
    .row {
      display: grid;
      grid-template-columns: auto auto auto auto;
      gap: 8px;
      padding: 6px 0;
    }
    .header {
      font-weight: 600;
      margin-bottom: 8px;
    }
  `;

  public hass!: Hass;
  private _config: any = null;
  private _selectedStation: string = "";

  setConfig(config: any) {
    if (!config.entity_map) {
      throw new Error("You need to define entity_map");
    }
    this._config = { ...config };
    this._selectedStation =
      config.default_station || Object.keys(config.entity_map)[0];
  }

  static getStubConfig() {
    return {
      type: "custom:tursib-card",
      entity_map: { Default: "sensor.test" },
      default_station: "Default",
      layout_mode: "fixed",
      station_selector: "buttons",
      station_label_color: "#0044cc",
      card_width: "480px",
      badge_width: "3em",
      destination_width: "300px",
      destination_font_size: "10px",
      departure_font_size: "10px",
      minutes_font_size: "12px",
      minutes_color: "green",
      divider_thickness: "2px",
      card_background: "transparent",
      card_radius: "12px",
      colors: {}
    };
  }

  static async getConfigElement() {
    return document.createElement("tursib-card-editor");
  }

  getCardSize() {
    return 3;
  }

  render() {
    if (!this._config || !this.hass) return html``;

    const map = this._config.entity_map || {};
    const station = this._selectedStation;
    const entityId = map[station];
    const st = this.hass.states[entityId];
    if (!st) return html``;

    const departures = st.attributes.departures || [];

    const style = `
      width: ${this._config.card_width};
      background: ${this._config.card_background};
      border-radius: ${this._config.card_radius};
      font-family: sans-serif;
      padding: 0.8em;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    `;

    return html`
      <ha-card style="${style}">
        <div class="header" style="color:${this._config.station_label_color}">
          ${station}
        </div>
        ${departures.map(
          (o: any) => html`
            <div class="row" style="border-bottom:${this._config.divider_thickness} solid rgba(0,0,0,0.1)">
              <span style="width:${this._config.badge_width}; color:${this._config.colors?.[o.line] || "black"}">
                ${o.line}
              </span>
              <span style="width:${this._config.destination_width}; font-size:${this._config.destination_font_size}">
                ${o.destination}
              </span>
              <span style="font-size:${this._config.minutes_font_size}; color:${this._config.minutes_color}">
                ${o.minutes} min
              </span>
              <span style="font-size:${this._config.departure_font_size}">
                ${o.departure}
              </span>
            </div>
          `
        )}
      </ha-card>
    `;
  }
}

customElements.define("tursib-card", TursibCard);
