(function () {
    const ships = {
        "Gauntlet Fighter": {
            "Ezra Bridger": { cost: 56, forceSlots: 2, crewSlots: 1, gunnerSlots: 1, bombSlots: 1, illicitSlots: 1, modificationSlots: 2, configurationSlots: 1, titleSlots: 1, upgradeLimit: 13 },
            "Chopper": { cost: 50, forceSlots: 0, crewSlots: 1, gunnerSlots: 1, bombSlots: 1, illicitSlots: 1, modificationSlots: 2, configurationSlots: 1, titleSlots: 1, upgradeLimit: 12 },
            "Mandalorian Resistance Pilot": { cost: 47, talentSlots: 1, crewSlots: 1, gunnerSlots: 1, bombSlots: 1, illicitSlots: 1, modificationSlots: 1, configurationSlots: 1, upgradeLimit: 9 }
        }
}
    // Kategorie ulepszeń
    const gauntletExtras = {
        "Force Upgrade": { "Fire-Control System": 3, "Engine Tuning": 2 },
        "Crew Upgrade": { "Hera Syndulla": 4, "Kanan Jarrus": 5 },
        "Gunner Upgrade": { "Rebel Gunner": 3 },
        "Bomb Upgrade": { "Proton Bombs": 4, "Seismic Charges": 3 },
        "Illicit Upgrade": { "Cluster Mines": 3, "Rage": 4 },
        "Modification Upgrade": { "Hull Upgrade": 5, "Shield Upgrade": 4 },
        "Configuration Upgrade": { "Gauntlet Teslak": 0 },
        "Title Upgrade": { "Rebel Leader": 1 },
        "Talent Upgrade": { "Predator": 3, "Outmaneuver": 4, "Lone Wolf": 4 }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section gauntlet";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="Gauntlet Fighter">Gauntlet Fighter</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
        for (let ship in ships) {
            for (let pilot in ships[ship]) {
                const cost = ships[ship][pilot].cost;
                pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${cost} pkt)</option>`;
            }
        }
        pilotSelect.onchange = () => updateUpgrades(shipDiv);
        shipDiv.appendChild(pilotSelect);

        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updateUpgrades(shipDiv);
    }

    function updateUpgrades(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        upgradeSection.innerHTML = "";
        pointsDiv.innerHTML = "";
        if (!pilot) return;

        const shipName = shipDiv.querySelector(".ship-select").value;
        const data = ships[shipName][pilot];
        [
            ["Talent Upgrade", data.talentSlots],
            ["Crew Upgrade", data.crewSlots],
            ["Gunner Upgrade", data.gunnerSlots],
            ["Bomb Upgrade", data.bombSlots],
            ["Illicit Upgrade", data.illicitSlots],
            ["Modification Upgrade", data.modificationSlots],
            ["Configuration Upgrade", data.configurationSlots],
            ["Title Upgrade", data.titleSlots]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= count; i++) {
                createUpgradeSelect(upgradeSection, cat, gauntletExtras[cat], `No ${cat} (Slot ${i})`);
            }
        });

        updateUpgradePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value="">${defaultText}</option>`;
        for (let key in options) {
            select.innerHTML += `<option value="${key}">${key} (${options[key]} pkt)</option>`;
        }
        select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const points = calculateUpgradePoints(shipDiv);
        const shipName = shipDiv.querySelector(".ship-select").value;
        const limit = ships[shipName][pilot].upgradeLimit;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            return sum + (val && gauntletExtras[cat][val] || 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const shipName = shipDiv.querySelector(".ship-select").value;
        return ships[shipName][pilot]?.cost || 0;
    }

    window.gauntletRules = { addShip, calculateUpgradePoints, getPilotPoints, getUpgradePoints: calculateUpgradePoints };
})();
