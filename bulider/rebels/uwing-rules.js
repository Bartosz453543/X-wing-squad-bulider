(function () {
    // Dane dla statków U-wing – instrukcje dla pilotów
    const ships = {
        "U-wing": {
            "Saw Gerrera": { cost: 4, upgradeLimit: 12, force: 0, talentSlots: 1, crewSlots: 2, sensorSlots: 1, illicitSlots: 1, modificationSlots: 1, configurationSlots: 1 },
            "Bodhi Rook": { cost: 3, upgradeLimit: 8, force: 0, crewSlots: 2, sensorSlots: 1, modificationSlots: 1, configurationSlots: 1 },
            "Cassian Andor": { cost: 4, upgradeLimit: 10, force: 0, talentSlots: 1, crewSlots: 2, configurationSlots: 1 },
            "Heff Tobber": { cost: 2, upgradeLimit: 6, force: 0, crewSlots: 2, modificationSlots: 1, configurationSlots: 1 },
            "Magva Yarro": { cost: 3, upgradeLimit: 8, force: 0, talentSlots: 1, crewSlots: 2, sensorSlots: 1, illicitSlots: 1, modificationSlots: 1, configurationSlots: 1 },
            "Benthic Two-Tubes": { cost: 3, upgradeLimit: 8, force: 0, talentSlots: 1, crewSlots: 3, sensorSlots: 0, illicitSlots: 1, modificationSlots: 2, configurationSlots: 1 },
            "Blu Squadron Scout": { cost: 3, upgradeLimit: 8, force: 0, talentSlots: 0, crewSlots: 2, sensorSlots: 0, modificationSlots: 1, configurationSlots: 1 },
            "Partisan Renegade": { cost: 3, upgradeLimit: 8, force: 0, crewSlots: 2, illicitSlots: 1, modificationSlots: 1, configurationSlots: 1 },
            "K-2SO": { cost: 4, upgradeLimit: 10, force: 0, crewSlots: 2, sensorSlots: 1, modificationSlots: 1, configurationSlots: 1 }
        }
    };

    const uWingExtras = {
        "Talent Upgrade": { "Trick Shot": 3, "Selfless": 4 },
        "Crew Upgrade": { "Leia Organa": 6, "K-2SO": 5, "Jyn Erso": 4, "Maul" : 12},
        "Sensor Upgrade": { "Perceptive Copilot": 5, "Advanced Sensors": 6 },
        "Illicit Upgrade": { "Deadman’s Switch": 2, "False Transponder Codes": 3 },
        "Modification": { "Shield Upgrade": 6, "Hull Upgrade": 5 },
        "Configuration": { "Pivot Wing": 0 }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section uwing";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="U-wing">U-wing</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
        pilotSelect.onchange = function () {
            updateUpgrades(shipDiv);
        };
        shipDiv.appendChild(pilotSelect);

        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updatePilotOptions(shipDiv, "U-wing");
    }

    function updatePilotOptions(shipDiv, selectedShip) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
        if (ships[selectedShip]) {
            for (let pilot in ships[selectedShip]) {
                pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${ships[selectedShip][pilot].cost} pkt)</option>`;
            }
        }
        updateUpgrades(shipDiv);
    }

    function updateUpgrades(shipDiv) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        upgradeSection.innerHTML = "";
        pointsDiv.innerHTML = "";
        if (!pilotSelect.value) return;

        const pilotData = ships["U-wing"][pilotSelect.value];

        if (pilotData.talentSlots) {
            for (let i = 1; i <= pilotData.talentSlots; i++) {
                createUpgradeSelect(upgradeSection, "Talent Upgrade", uWingExtras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.crewSlots) {
            for (let i = 1; i <= pilotData.crewSlots; i++) {
                createUpgradeSelect(upgradeSection, "Crew Upgrade", uWingExtras["Crew Upgrade"], `No Crew Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.sensorSlots) {
            for (let i = 1; i <= pilotData.sensorSlots; i++) {
                createUpgradeSelect(upgradeSection, "Sensor Upgrade", uWingExtras["Sensor Upgrade"], `No Sensor Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.illicitSlots) {
            for (let i = 1; i <= pilotData.illicitSlots; i++) {
                createUpgradeSelect(upgradeSection, "Illicit Upgrade", uWingExtras["Illicit Upgrade"], `No Illicit Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.modificationSlots) {
            for (let i = 1; i <= pilotData.modificationSlots; i++) {
                createUpgradeSelect(upgradeSection, "Modification", uWingExtras["Modification"], `No Modification (Slot ${i})`);
            }
        }
        if (pilotData.configurationSlots) {
            for (let i = 1; i <= pilotData.configurationSlots; i++) {
                createUpgradeSelect(upgradeSection, "Configuration", uWingExtras["Configuration"], `No Configuration (Slot ${i})`);
            }
        }

        updateUpgradePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, optionsObj, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value=''>${defaultText}</option>`;
        for (let upgrade in optionsObj) {
            select.innerHTML += `<option value='${upgrade}'>${upgrade} (${optionsObj[upgrade]} pkt)</option>`;
        }
        select.onchange = function () {
            updateUpgradePointsDisplay(container.parentNode);
        };
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        const upgradePoints = calculateUpgradePoints(shipDiv);
        const upgradeLimit = ships["U-wing"][pilotSelect.value]?.upgradeLimit || 0;
        pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
        if (typeof updateGlobalTotalPoints === 'function') {
            updateGlobalTotalPoints();
        }
    }

    function calculateUpgradePoints(shipDiv) {
        let total = 0;
        const selects = shipDiv.querySelectorAll(".upgrade-select");
        selects.forEach(select => {
            const extras = uWingExtras[select.dataset.category];
            if (select.value && extras && extras[select.value]) {
                total += extras[select.value];
            }
        });
        return total;
    }

    function getPilotPoints(shipDiv) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        if (pilotSelect && pilotSelect.value) {
            return ships["U-wing"][pilotSelect.value].cost;
        }
        return 0;
    }

    window.uwingRules = {
        addShip: addShip,
        calculateUpgradePoints: calculateUpgradePoints,
        getPilotPoints: getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
