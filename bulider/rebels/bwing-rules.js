(function () {
    const ships = {
        "B-Wing": {
            "Hera Syndulle (Rebelia)": {cost: 7, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 1, bombSlots: 1, modificationSlots: 1, titleSlots: 1, configurationSlots: 1, upgradeLimit: 12},
            "Gina Moonsong (Rebelia)": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Gina Moonsong Battle Over Endor": {cost: 6, talentSlots: 2, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 13},
            "Braylen Stramma (Rebelia)": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Braylen Stramma Battle Over Endor": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 0, missileSlots: 1, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Adon Fox Battle Over Endor": {cost: 6, talentSlots: 2, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 0, missileSlots: 1, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 12},
            "Ten Numb (Rebelia)": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Netrem Pollard (Rebelia)": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 0, missileSlots: 1, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Blade Squadron Veteran (Rebelia)": {cost: 5, talentSlots: 0, sensorSlots: 2, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 0, modificationSlots: 0, titleSlots: 0, configurationSlots: 1, upgradeLimit: 10},
            "Blue Squadron Pilot (Rebelia)": {cost: 5, talentSlots: 0, sensorSlots: 2, cannonSlots: 2, torpedoSlots: 0, missileSlots: 0, bombSlots: 1, modificationSlots: 0, titleSlots: 0, configurationSlots: 1, upgradeLimit: 10}
        }
    };

    const bwingExtras = {
        "Talent": {"Intrepid": 4, "Fearless": 3, "It's a Trap": 3, "Juke": 2, "Parting Gift": 2},
        "Sensor": {"Sensor Jammer": 5},
        "Cannon": {"Autoblaster": 3, "Heavy Laser Cannon": 4},
        "Torpedo": {"Proton Torpedoes": 5},
        "Missile": {"Concussion Missiles": 3, "Homing Missiles": 4, "Proton Racket": 5},
        "Bomb": {"Proton Bombs": 4, "Ion Bombs": 3},
        "Modification": {"Hull Upgrade": 6, "Engine Upgrade": 4, "Delayed Fuses": 1},
        "Title": {"B6 Blade Wing Prototype": 2},
        "Configuration": {"Stabilized S-Foils": 2}
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section bwing";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="B-Wing">B-Wing</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
        pilotSelect.onchange = () => updateUpgrades(shipDiv);
        shipDiv.appendChild(pilotSelect);

        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updatePilotOptions(shipDiv, "B-Wing");
    }

    function updatePilotOptions(shipDiv, selectedShip) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
        if (ships[selectedShip]) {
            for (let pilot in ships[selectedShip]) {
                const cost = ships[selectedShip][pilot].cost;
                pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${cost} pkt)</option>`;
            }
        }
        updateUpgrades(shipDiv);
    }

    function updateUpgrades(shipDiv) {
        const pilotSel = shipDiv.querySelector(".pilot-select");
        const pilot = pilotSel.value;
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        upgradeSection.innerHTML = "";
        pointsDiv.innerHTML = "";
        if (!pilot) return;

        const data = ships["B-Wing"][pilot];

        const presets = {
            "Gina Moonsong Battle Over Endor": [
                ["Talent", "It's a Trap"],
                ["Talent", "Juke"],
                ["Torpedo", "Proton Torpedoes"],
                ["Bomb", "Ion Bombs"]
            ],
            "Braylen Stramma Battle Over Endor": [
                ["Talent", "It's a Trap"],
                ["Missile", "Homing Missiles"],
                ["Bomb", "Proton Bombs"],
                ["Modification", "Delayed Fuses"]
            ],
            "Adon Fox Battle Over Endor": [
                ["Talent", "It's a Trap"],
                ["Talent", "Parting Gift"],
                ["Missile", "Proton Racket"],
                ["Bomb", "Proton Bombs"]
            ]
        };

        if (presets[pilot]) {
            let total = 0;
            presets[pilot].forEach(([cat, val]) => {
                const sel = document.createElement("select");
                sel.className = "upgrade-select";
                sel.disabled = true;
                sel.dataset.category = cat;
                sel.innerHTML = `<option>${val}</option>`;
                total += bwingExtras[cat][val] || 0;
                upgradeSection.appendChild(sel);
            });
            pointsDiv.innerHTML = `Użyte punkty: ${total}/${data.upgradeLimit}`;
            return;
        }

        [
            ["Talent", data.talentSlots],
            ["Sensor", data.sensorSlots],
            ["Cannon", data.cannonSlots],
            ["Torpedo", data.torpedoSlots],
            ["Missile", data.missileSlots],
            ["Bomb", data.bombSlots],
            ["Modification", data.modificationSlots],
            ["Title", data.titleSlots],
            ["Configuration", data.configurationSlots]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= (count || 0); i++) {
                createUpgradeSelect(upgradeSection, cat, bwingExtras[cat], `No ${cat} (Slot ${i})`);
            }
        });

        updateUpgradePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value="">${defaultText}</option>`;
        for (let key in options) select.innerHTML += `<option value="${key}">${key} (${options[key]} pkt)</option>`;
        select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        if (!ships["B-Wing"][pilot]) {
            shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: 0 / -`;
            return;
        }
        const points = calculateUpgradePoints(shipDiv);
        const limit = ships["B-Wing"][pilot].upgradeLimit;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            return sum + (val && bwingExtras[cat][val] || 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        return ships["B-Wing"][pilot]?.cost || 0;
    }

    window.bwingRules = { addShip, calculateUpgradePoints, getPilotPoints, getUpgradePoints: calculateUpgradePoints };
})();