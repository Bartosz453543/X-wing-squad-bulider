(function () {
    // Dane dla K‑Wing – każdy pilot w osobnej linii, definicje w kompaktowej formie
    const ships = {
        "K-Wing": {
            "Miranda Doni": {cost: 7, torpedoSlots: 1, missileSlots: 1, crewSlots: 1, bombSlots: 2, modificationSlots: 1, gunnerSlots: 1, upgradeLimit: 12, upgrades: ["Torpedo: Proton Torpedoes", "Missile: Concussion Missiles", "Crew: R2-D2", "Bomb: Proton Bombs", "Modification: Engine Upgrade", "Gunner: Veteran Instincts"]},
            "Esege Tuketu": {cost: 6, torpedoSlots: 1, missileSlots: 2, crewSlots: 1, bombSlots: 1, modificationSlots: 1, gunnerSlots: 1, upgradeLimit: 12, upgrades: ["Torpedo: Proton Torpedoes", "Missile: Concussion Missiles", "Missile: Seismic Charges", "Crew: R2-D2", "Bomb: Proton Bombs", "Modification: Engine Upgrade", "Gunner: Veteran Instincts"]},
            "Warden Squadron Pilot": {cost: 5, torpedoSlots: 1, missileSlots: 1, crewSlots: 0, bombSlots: 2, modificationSlots: 0, gunnerSlots: 1, upgradeLimit: 10, upgrades: ["Torpedo: Proton Torpedoes", "Missile: Concussion Missiles", "Bomb: Proton Bombs", "Gunner: Veteran Instincts"]}
        }
    };

    // Kategorie ulepszeń
    const kwingExtras = {
        "Torpedo": {"Proton Torpedoes": 5},
        "Missile": {"Concussion Missiles": 3},
        "Crew": {"R2-D2": 4},
        "Bomb": {"Proton Bombs": 4},
        "Modification": {"Engine Upgrade": 4},
        "Gunner": {"Veteran Instincts": 2}
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section kwing";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value=\"K-Wing\">K-Wing</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value=\"\">Select Pilot</option>`;
        pilotSelect.onchange = () => updateUpgrades(shipDiv);
        shipDiv.appendChild(pilotSelect);

        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updatePilotOptions(shipDiv, "K-Wing");
    }

    function updatePilotOptions(shipDiv, selectedShip) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        pilotSelect.innerHTML = `<option value=\"\">Select Pilot</option>`;
        if (ships[selectedShip]) {
            for (let pilot in ships[selectedShip]) {
                const cost = ships[selectedShip][pilot].cost;
                pilotSelect.innerHTML += `<option value=\"${pilot}\">${pilot} (${cost} pkt)</option>`;
            }
        }
        updateUpgrades(shipDiv);
    }

    function updateUpgrades(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        upgradeSection.innerHTML = "";
        pointsDiv.innerHTML = "";
        if (!pilot) return;

        const data = ships["K-Wing"][pilot];
        [
            ["Torpedo", data.torpedoSlots],
            ["Missile", data.missileSlots],
            ["Crew", data.crewSlots],
            ["Bomb", data.bombSlots],
            ["Modification", data.modificationSlots],
            ["Gunner", data.gunnerSlots]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= (count || 0); i++) {
                createUpgradeSelect(upgradeSection, cat, kwingExtras[cat], `No ${cat} (Slot ${i})`);
            }
        });

        updateUpgradePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value=\"\">${defaultText}</option>`;
        for (let key in options) select.innerHTML += `<option value=\"${key}\">${key} (${options[key]} pkt)</option>`;
        select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const points = calculateUpgradePoints(shipDiv);
        const limit = ships["K-Wing"][pilot].upgradeLimit;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            return sum + (val && kwingExtras[cat][val] || 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        return ships["K-Wing"][pilot]?.cost || 0;
    }

    window.kwingRules = { addShip, calculateUpgradePoints, getPilotPoints, getUpgradePoints: calculateUpgradePoints };
})();
