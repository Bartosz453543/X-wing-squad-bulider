(function () {
    const ships = {
        "B-Wing": {
            "Hera Syndulla": {
                cost: 65,
                slots: [ "Talent", "Sensor", "Cannon", "Cannon", "Torpedo", "Missile", "Bomb", "Modification", "Title", "Configuration" ],
                upgradeLimit: 15
            },
            "Gina Moonsong": {
                cost: 62,
                slots: [ "Talent", "Sensor", "Cannon", "Cannon", "Torpedo", "Modification", "Bomb", "Configuration" ],
                upgradeLimit: 14
            }
        }
    };

    const upgrades = {
        "Talent": { "Intrepid": 4, "Fearless": 3 },
        "Sensor": { "Sensor Jammer": 5 },
        "Cannon": { "Autoblaster": 3, "Heavy Laser Cannon": 4 },
        "Torpedo": { "Proton Torpedoes": 5 },
        "Missile": { "Concussion Missiles": 3 },
        "Bomb": { "Proton Bombs": 4 },
        "Modification": { "Hull Upgrade": 6, "Engine Upgrade": 4 },
        "Title": { "B6 Blade Wing Prototype": 2 },
        "Configuration": { "Stabilized S-Foils": 2 }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section bwing";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="B-Wing">B‑Wing</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
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
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
        if (ships[selectedShip]) {
            for (let pilot in ships[selectedShip]) {
                const cost = ships[selectedShip][pilot].cost;
                pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${cost} pkt)</option>`;
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

        const pilotData = ships["B-Wing"][pilotSelect.value];

        pilotData.slots.forEach((slotType, index) => {
            const slotLabel = `No ${slotType} (Slot ${index + 1})`;
            createUpgradeSelect(upgradeSection, slotType, upgrades[slotType], slotLabel);
        });

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
        select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        const upgradePoints = calculateUpgradePoints(shipDiv);
        const upgradeLimit = ships["B-Wing"][pilotSelect.value]?.upgradeLimit || 0;
        pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
        if (typeof updateGlobalTotalPoints === 'function') {
            updateGlobalTotalPoints();
        }
    }

    function calculateUpgradePoints(shipDiv) {
        let total = 0;
        const selects = shipDiv.querySelectorAll(".upgrade-select");
        selects.forEach(select => {
            const extras = upgrades[select.dataset.category];
            if (select.value && extras && extras[select.value]) {
                total += extras[select.value];
            }
        });
        return total;
    }

    function getPilotPoints(shipDiv) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        if (pilotSelect && pilotSelect.value) {
            return ships["B-Wing"][pilotSelect.value].cost;
        }
        return 0;
    }

    window.bwingRules = {
        addShip,
        calculateUpgradePoints,
        getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
