class TursibCard extends HTMLElement {
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error("Trebuie să definești entities: [lista de senzori]");
    }
    this.config = config;
  }

  set hass(hass) {
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    root.innerHTML = "";

    const card = document.createElement("ha-card");
    card.style.padding = "12px";
    card.style.borderRadius = "12px";
    card.style.background = "var(--card-background-color)";

    // pentru fiecare senzor definit în config
    this.config.entities.forEach(entityId => {
      const entity = hass.states[entityId];
      if (!entity) return;

      const departures = entity.attributes.departures || [];
      departures.slice(0, 3).forEach(dep => {
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
        line.style.backgroundColor = this.getLineColor(dep.line);

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
    });

    root.appendChild(card);
  }

  getLineColor(line) {
    if (line === "11") return "#2e7d32";
    if (line === "1") return "#FF4208";
    if (line === "14") return "#8412F6";
    if (line === "217") return "#f9a825";
    if (line === "111") return "#d32f2f";
    if (line === "E7") return "#1976d2";
    return "#FF3FFF";
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("tursib-card", TursibCard);
