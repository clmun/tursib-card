import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import "./tursib-card-editor";

export class TursibCard extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @property({ attribute: false }) private _config!: any;

  public setConfig(config: any): void {
    if (!config.entity_map) {
      throw new Error("You need to define entity_map");
    }
    this._config = config;
    this._selectedStation = config.default_station || Object.keys(config.entity_map)[0];
  }

  private _selectedStation: string = "";

  static getStubConfig() {
    return {
      type: "custom:tursib-card",
      entity_map: { "Default": "sensor.test" },
      station_selector: "dropdown",
      layout_mode: "fixed",
      card_background: "#f9f9f9",
      card_radius: "12px"
    };
  }

  static async getConfigElement() {
    return document.createElement("tursib-card-editor");
  }

  public getCardSize(): number {
    return 3;
  }

  static styles = css`
    .tursib-card {
      font-family: sans-serif;
      padding: 0.8em;
      background: var(--card-background-color, #f9f9f9);
      border-radius: var(--card-radius, 12px);
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
  `;

  protected render() {
    if (!this._config || !this.hass) return html``;

    const entityMap = this._config.entity_map || {};
    const currentStation = this._selectedStation;
    const entityId = entityMap[currentStation];
    const entity = this.hass.states[entityId];
    if (!entity) return html``;

    const data = entity.attributes.departures || [];

    return html`
      <div class="tursib-card">
        <div class="header">${currentStation}</div>
        ${data.map((dep: any) => html`
          <div class="row">
            <span>${dep.line}</span>
            <span>${dep.destination}</span>
            <span>${dep.minutes} min</span>
            <span>${dep.departure}</span>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define("tursib-card", TursibCard);
