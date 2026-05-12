class TursibCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
  }

  connectedCallback() {
    const cfg = this._config || {};
    this.innerHTML = `
      <style>
        .editor { font-family: sans-serif; color: #111; }
        .editor label { display: block; margin: 0.4em 0 0.15em; font-weight: 600; }
        .editor input[type=text], .editor input[type=number], .editor select, .editor textarea {
          width: 100%; padding: 0.45em 0.5em; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;
          font-family: inherit; font-size: 0.95rem;
        }
        .editor textarea { font-family: inherit; min-height: 90px; }
        .editor .field { margin-bottom: 1rem; }
        .editor .group { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
        .editor .full-width { grid-column: 1 / -1; }
      </style>
      <div class="editor">
        <div class="field"><label>Card title</label><input id="cardTitle" type="text" value="${cfg.card_title || cfg.title || ""}"></div>
        <div class="field"><label>Default station</label><input id="defaultStation" type="text" value="${cfg.default_station || ""}"></div>
        <div class="field full-width"><label>Entity map (JSON)</label><textarea id="entityMap">${JSON.stringify(cfg.entity_map || {}, null, 2)}</textarea></div>
        <div class="field full-width"><label>Line colors (JSON)</label><textarea id="colors">${JSON.stringify(cfg.colors || {}, null, 2)}</textarea></div>
        <div class="group">
          <div class="field"><label>Station selector</label><select id="stationSelector"><option value="dropdown" ${cfg.station_selector !== 'buttons' && cfg.station_selector !== 'none' ? 'selected' : ''}>dropdown</option><option value="buttons" ${cfg.station_selector === 'buttons' ? 'selected' : ''}>buttons</option><option value="none" ${cfg.station_selector === 'none' ? 'selected' : ''}>none</option></select></div>
          <div class="field"><label>Layout mode</label><select id="layoutMode"><option value="fixed" ${cfg.layout_mode !== 'fluid' ? 'selected' : ''}>fixed</option><option value="fluid" ${cfg.layout_mode === 'fluid' ? 'selected' : ''}>fluid</option></select></div>
        </div>
        <div class="group">
          <div class="field"><label>Show header</label><select id="showHeader"><option value="true" ${cfg.show_header !== false ? 'selected' : ''}>true</option><option value="false" ${cfg.show_header === false ? 'selected' : ''}>false</option></select></div>
          <div class="field"><label>Show current time</label><select id="showCurrentTime"><option value="true" ${cfg.show_current_time !== false ? 'selected' : ''}>true</option><option value="false" ${cfg.show_current_time === false ? 'selected' : ''}>false</option></select></div>
        </div>
        <div class="group">
          <div class="field"><label>Time format</label><select id="timeFormat"><option value="24h" ${cfg.time_format !== '12h' ? 'selected' : ''}>24h</option><option value="12h" ${cfg.time_format === '12h' ? 'selected' : ''}>12h</option></select></div>
          <div class="field"><label>Title color</label><input id="titleColor" type="text" value="${cfg.title_color || '#111'}"></div>
        </div>
        <div class="group">
          <div class="field"><label>Card background</label><input id="cardBackground" type="text" value="${cfg.card_background || "#f9f9f9"}"></div>
          <div class="field"><label>Card radius</label><input id="cardRadius" type="text" value="${cfg.card_radius || "12px"}"></div>
        </div>
        <div class="group">
          <div class="field"><label>Card width</label><input id="cardWidth" type="text" value="${cfg.card_width || "400px"}"></div>
          <div class="field"><label>Card height</label><input id="cardHeight" type="text" value="${cfg.card_height || "auto"}"></div>
        </div>
        <div class="group">
          <div class="field"><label>Badge width</label><input id="badgeWidth" type="text" value="${cfg.badge_width || "3em"}"></div>
          <div class="field"><label>Destination width</label><input id="destinationWidth" type="text" value="${cfg.destination_width || "200px"}"></div>
        </div>
        <div class="group">
          <div class="field"><label>Destination font size</label><input id="destinationFontSize" type="text" value="${cfg.destination_font_size || "14px"}"></div>
          <div class="field"><label>Departure font size</label><input id="departureFontSize" type="text" value="${cfg.departure_font_size || "16px"}"></div>
        </div>
        <div class="group">
          <div class="field"><label>Minutes font size</label><input id="minutesFontSize" type="text" value="${cfg.minutes_font_size || "18px"}"></div>
          <div class="field"><label>Minutes color</label><input id="minutesColor" type="text" value="${cfg.minutes_color || "green"}"></div>
        </div>
        <div class="group">
          <div class="field"><label>Divider color</label><input id="dividerColor" type="text" value="${cfg.divider_color || "blue"}"></div>
          <div class="field"><label>Divider thickness</label><input id="dividerThickness" type="text" value="${cfg.divider_thickness || "2px"}"></div>
        </div>
        <div class="group">
          <div class="field"><label>Station label color</label><input id="stationLabelColor" type="text" value="${cfg.station_label_color || '#000'}"></div>
          <div class="field"><label>Badge text color</label><input id="badgeTextColor" type="text" value="${cfg.badge_text_color || '#fff'}"></div>
        </div>
        <div class="group">
          <div class="field"><label>Show station title</label><select id="showStationTitle"><option value="true" ${cfg.show_station_title !== false ? 'selected' : ''}>true</option><option value="false" ${cfg.show_station_title === false ? 'selected' : ''}>false</option></select></div>
          <div class="field"><label>Row gap</label><input id="rowGap" type="text" value="${cfg.row_gap || '0.4em'}"></div>
        </div>
      </div>
    `;

    const fields = [
      'cardTitle', 'defaultStation', 'stationSelector', 'layoutMode', 'showHeader', 'showCurrentTime',
      'timeFormat', 'titleColor', 'cardBackground', 'cardRadius', 'cardWidth', 'cardHeight',
      'badgeWidth', 'destinationWidth', 'destinationFontSize', 'departureFontSize', 'minutesFontSize',
      'minutesColor', 'dividerColor', 'dividerThickness', 'stationLabelColor', 'badgeTextColor', 'showStationTitle', 'rowGap'
    ];

    fields.forEach(id => {
      const el = this.querySelector(`#${id}`);
      if (!el) return;
      el.addEventListener('change', () => {
        const value = el.value;
        if (id === 'showHeader' || id === 'showCurrentTime' || id === 'showStationTitle') {
          this._config[id === 'showHeader' ? 'show_header' : id === 'showCurrentTime' ? 'show_current_time' : 'show_station_title'] = value === 'true';
        } else if (id === 'defaultStation') {
          this._config.default_station = value;
        } else if (id === 'cardTitle') {
          this._config.card_title = value;
        } else if (id === 'timeFormat') {
          this._config.time_format = value;
        } else if (id === 'stationSelector') {
          this._config.station_selector = value;
        } else if (id === 'layoutMode') {
          this._config.layout_mode = value;
        } else if (id === 'titleColor') {
          this._config.title_color = value;
        } else if (id === 'cardBackground') {
          this._config.card_background = value;
        } else if (id === 'cardRadius') {
          this._config.card_radius = value;
        } else if (id === 'cardWidth') {
          this._config.card_width = value;
        } else if (id === 'cardHeight') {
          this._config.card_height = value;
        } else if (id === 'badgeWidth') {
          this._config.badge_width = value;
        } else if (id === 'destinationWidth') {
          this._config.destination_width = value;
        } else if (id === 'destinationFontSize') {
          this._config.destination_font_size = value;
        } else if (id === 'departureFontSize') {
          this._config.departure_font_size = value;
        } else if (id === 'minutesFontSize') {
          this._config.minutes_font_size = value;
        } else if (id === 'minutesColor') {
          this._config.minutes_color = value;
        } else if (id === 'dividerColor') {
          this._config.divider_color = value;
        } else if (id === 'dividerThickness') {
          this._config.divider_thickness = value;
        } else if (id === 'stationLabelColor') {
          this._config.station_label_color = value;
        } else if (id === 'badgeTextColor') {
          this._config.badge_text_color = value;
        } else if (id === 'rowGap') {
          this._config.row_gap = value;
        }
        this._updateConfig();
      });
    });

    const jsonFields = [
      { id: 'entityMap', key: 'entity_map', defaultValue: {} },
      { id: 'colors', key: 'colors', defaultValue: {} }
    ];

    jsonFields.forEach(field => {
      const el = this.querySelector(`#${field.id}`);
      if (!el) return;
      el.addEventListener('change', () => {
        try {
          this._config[field.key] = JSON.parse(el.value || '{}');
          this._updateConfig();
        } catch (e) {
          console.error(`Invalid JSON for ${field.key}`);
        }
      });
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
