import { LitElement, html, css } from "lit";

type Hass = any;

class TursibCard extends LitElement {
  static styles = css`
    .tursib-card {
      padding: 0.8em;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .row {
      display: grid;
      grid-template-columns: 60px 1fr 80px 120px;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid rgba(0,0,0,0.06);
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
      station_selector: "dropdown",
      layout_mode: "fixed",
      card_background: "#f9f9f9",
      card_radius: "12px",
      font_family: "sans-serif"
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

    // Stiluri dinamice din config
    const style = `
      background: ${this._config.card_background || "#f9f9f9"};
      border-radius: ${this._config.card_radius || "12px"};
      font-family: ${this._config.font_family || "sans-serif"};
    `;

    return html`
      <ha-card style="${style}">
        <div class="tursib-card">
          <div class="header">${station}</div>
          ${departures.map(
            (o: any) => html`
              <div class="row">
                <span>${o.line}</span>
                <span>${o.destination}</span>
                <span>${o.minutes} min</span>
                <span>${o.departure}</span>
              </div>
            `
          )}
        </div>
      </ha-card>
    `;
  }
}

customElements.define("tursib-card", TursibCard);
