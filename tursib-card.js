class TursibCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("Trebuie să alegi un senzor (entity).");
    }
    this.config = {
      colors: {
        "11": "#2e7d32",
        "1": "#FF4208",
        "14": "#8412F6",
        "217": "#f9a825",
        "111": "#d32f2f",
        "E7": "#1976d2",
        ...config.colors
      },
      ...config
    };
  }

  set hass(hass) {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    root.innerHTML = "";

    const card = document.createElement("ha-card");
    card.style.padding = "12px";
    card.style.borderRadius = "12px";
    card.style.background = "var(--card-background-color)";

    const entity = hass.states[this.config.entity];
    if (!entity) {
      card.innerHTML = "<p>Entity not found</p>";
      root.appendChild(card);
      return;
    }

    const departures = entity.attributes.departures || [];
    departures.slice(0, 4).forEach(dep => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.marginBottom = "6px";

      // Linie
      const line = document.createElement("div");
      line.textContent = dep.line;
      line.style.fontWeight = "bold";
      line.style.color = "white";
      line.style.padding = "4px 8px";
      line.style.borderRadius = "6px";
      line.style.backgroundColor = this.config.colors[dep.line] || "#FF3FFF";

      // Destinație
      const dest = document.createElement("div");
      dest.textContent = dep.destination;
      dest.style.fontSize = "12px";
      dest.style.flex = "1";
      dest.style.marginLeft = "10px";

      // Minute
      const minutes = document.createElement("div");
      const min = dep.minutes;
      minutes.innerHTML = `<span style="font-size:20px;font-weight:bold;color:green">${min} <span style="font-size:12px">min</span></span>`;

      row.appendChild(line);
      row.appendChild(dest);
      row.appendChild(minutes);
      card.appendChild(row);
    });

    root.appendChild(card);
  }

  getConfigElement() {
    return document.createElement("tursib-card-editor");
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("tursib-card", TursibCard);
