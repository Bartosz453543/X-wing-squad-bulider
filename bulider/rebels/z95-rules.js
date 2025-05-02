const z95Rules = (function() {
    // Definicja pilotów i ich slotów
    const ships = {
        "Z-95 Headhunter": {
            "Airen Cracken":         { cost: 30, talentSlots: 1, torpedoSlots: 1, sensorSlots: 1, modificationSlots: 1, upgradeLimit: 8 },
            "Lieutenant Blount":     { cost: 32, talentSlots: 2, missileSlots: 1, modificationSlots: 2, upgradeLimit: 8 },
            "Bandit Squadron Pilot": { cost: 25, missileSlots: 1, modificationSlots: 1, upgradeLimit: 6 },
            "Tala Squadron Pilot":   { cost: 26, talentSlots: 1, modificationSlots: 1, upgradeLimit: 6 }
        }
    };

    // Dostępne ulepszenia i ich koszty
    const upgrades = {
        "Talent Upgrade":       { "Outmaneuver": 4, "Swarm Tactics": 3 },
        "Missile Upgrade":      { "Ion Missiles": 3, "Cluster Missiles": 4 },
        "Torpedo Upgrade":      { "Proton Torpedoes": 5, "Adv. Proton Torpedoes": 6 },
        "Sensor Upgrade":       { "Fire-Control System": 3, "Passive Sensors": 2 },
        "Modification Upgrade": { "Shield Upgrade": 4, "Stealth Device": 3 }
    };

    // Mapowanie slotów na kategorie ulepszeń
    const slotToCategory = {
        talentSlots:       "Talent Upgrade",
        missileSlots:      "Missile Upgrade",
        torpedoSlots:      "Torpedo Upgrade",
        sensorSlots:       "Sensor Upgrade",
        modificationSlots: "Modification Upgrade"
    };

    // Dodaje nowy statek do DOM
    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section z95";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = "<option value='Z-95 Headhunter'>Z-95 Headhunter</option>";
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        // Domyślna opcja
        pilotSelect.innerHTML = "<option value=''>Select Pilot</option>";
        // Lista pilotów z punktacją
        for (let pilot in ships["Z-95 Headhunter"]) {
            const cost = ships["Z-95 Headhunter"][pilot].cost;
            pilotSelect.innerHTML += "<option value='" + pilot + "'>" + pilot + " (" + cost + " pkt)</option>";
        }
        shipDiv.appendChild(pilotSelect);

        const upgradesContainer = document.createElement("div");
        upgradesContainer.className = "upgrades-container";
        shipDiv.appendChild(upgradesContainer);

        pilotSelect.addEventListener("change", () => buildUpgradeSelectors(shipDiv));

        squadronDiv.appendChild(shipDiv);
    }

    // Buduje selektory ulepszeń wg slotów wybranego pilota
    function buildUpgradeSelectors(section) {
        const pilot = section.querySelector(".pilot-select").value;
        const upgradesContainer = section.querySelector(".upgrades-container");
        upgradesContainer.innerHTML = "";
        if (!ships["Z-95 Headhunter"][pilot]) return;
        const config = ships["Z-95 Headhunter"][pilot];
        for (let slotKey in slotToCategory) {
            const count = config[slotKey] || 0;
            const category = slotToCategory[slotKey];
            for (let i = 0; i < count; i++) {
                const sel = document.createElement("select");
                sel.className = "upgrade-select";
                sel.setAttribute("data-category", category);
                sel.innerHTML = "<option value=''>No " + category + "</option>";
                for (let name in upgrades[category]) {
                    sel.innerHTML += "<option value='" + name + "'>" + name + " (" + upgrades[category][name] + " pkt)</option>";
                }
                upgradesContainer.appendChild(sel);
            }
        }
    }

    // Zwraca punkty pilota
    function getPilotPoints(section) {
        const pilot = section.querySelector(".pilot-select").value;
        return ships["Z-95 Headhunter"][pilot]?.cost || 0;
    }

    // Zwraca sumę punktów za ulepszenia
    function getUpgradePoints(section) {
        let total = 0;
        section.querySelectorAll(".upgrade-select").forEach(sel => {
            const category = sel.getAttribute("data-category");
            const name = sel.value;
            if (name && upgrades[category] && upgrades[category][name] != null) {
                total += upgrades[category][name];
            }
        });
        return total;
    }

    return { addShip, getPilotPoints, getUpgradePoints };
})();
