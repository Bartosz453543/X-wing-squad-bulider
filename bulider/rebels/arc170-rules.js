(function () {
    // Dane dla statków ARC-170 – instrukcje dla pilotów
    const ships = {
        "ARC-170": {
            "Norra Wexley": { cost: 5, talentSlots: 2, torpedoSlots: 1, gunnerSlots: 1, astromechSlots: 1, modificationSlots: 1, upgradeLimit: 12 },
            "Shara Bey": { cost: 5, talentSlots: 1, torpedoSlots: 1, missileSlots: 1, gunnerSlots: 1, astromechSlots: 1, modificationSlots: 1, upgradeLimit: 15 },
            "Garven Dreis": { cost: 4, talentSlots: 1, missileSlots: 1, gunnerSlots: 1, astromechSlots: 1, modificationSlots: 1, cannonUpgradeSlots: 1, upgradeLimit: 3},
            "Ibtisam": { cost: 4, talentSlots: 1, torpedoSlots: 1, gunnerSlots: 1, astromechSlots: 1, modificationSlots: 1, upgradeLimit: 7 }
        }
    };

    const arc170Extras = {
        "Talent Upgrade": { "Predator": 3, "Expert Handling": 2, "Swarm Tactics": 2, "R2-D2": 3 },
        "Crew Upgrade": { "C-3PO": 4, "R2-D2": 3, "R5-P8": 2 },
        "Torpedo Upgrade": { "Proton Torpedoes": 4, "Concussion Missiles": 3 },
        "Missile Upgrade": { "Homing Missiles": 3 },
        "Gunner Upgrade": { "Wedge Antilles": 5, "Luke Skywalker": 4 },
        "Astromech Upgrade": { "R2-D2": 3, "R5-P8": 2 },
        "Modification Upgrade": { "Hull Upgrade": 5, "Shield Upgrade": 4 },
        "Configuration Upgrade": { "ARC-170 Configuration": 0 },
        "Cannon Upgrade": { "Laser Cannon": 4, "Ion Cannon": 3 } // Zmieniona kategoria: Cannon Upgrade
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section arc170";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="ARC-170">ARC-170</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
        pilotSelect.onchange = function () { updateUpgrades(shipDiv); };
        shipDiv.appendChild(pilotSelect);

        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updatePilotOptions(shipDiv, "ARC-170");
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

        const pilotData = ships["ARC-170"][pilotSelect.value];

        if (pilotData.talentSlots) {
            for (let i = 1; i <= pilotData.talentSlots; i++) {
                createUpgradeSelect(upgradeSection, "Talent Upgrade", arc170Extras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.torpedoSlots) {
            for (let i = 1; i <= pilotData.torpedoSlots; i++) {
                createUpgradeSelect(upgradeSection, "Torpedo Upgrade", arc170Extras["Torpedo Upgrade"], `No Torpedo Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.missileSlots) {
            for (let i = 1; i <= pilotData.missileSlots; i++) {
                createUpgradeSelect(upgradeSection, "Missile Upgrade", arc170Extras["Missile Upgrade"], `No Missile Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.gunnerSlots) {
            for (let i = 1; i <= pilotData.gunnerSlots; i++) {
                createUpgradeSelect(upgradeSection, "Gunner Upgrade", arc170Extras["Gunner Upgrade"], `No Gunner Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.cannonUpgradeSlots) {
            for (let i = 1; i <= pilotData.cannonUpgradeSlots; i++) {
                createUpgradeSelect(upgradeSection, "Cannon Upgrade", arc170Extras["Cannon Upgrade"], `No Cannon Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.astromechSlots) {
            for (let i = 1; i <= pilotData.astromechSlots; i++) {
                createUpgradeSelect(upgradeSection, "Astromech Upgrade", arc170Extras["Astromech Upgrade"], `No Astromech Upgrade (Slot ${i})`);
            }
        }
        if (pilotData.modificationSlots) {
            for (let i = 1; i <= pilotData.modificationSlots; i++) {
                createUpgradeSelect(upgradeSection, "Modification Upgrade", arc170Extras["Modification Upgrade"], `No Modification Upgrade (Slot ${i})`);
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
        select.onchange = function () { updateUpgradePointsDisplay(container.parentNode); };
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        const upgradePoints = calculateUpgradePoints(shipDiv);
        const upgradeLimit = ships["ARC-170"][pilotSelect.value]?.upgradeLimit || 0;
        pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
        if (typeof updateGlobalTotalPoints === 'function') { updateGlobalTotalPoints(); }
    }

    function calculateUpgradePoints(shipDiv) {
        let total = 0;
        const selects = shipDiv.querySelectorAll(".upgrade-select");
        selects.forEach(select => {
            const extras = arc170Extras[select.dataset.category];
            if (select.value && extras && extras[select.value]) {
                total += extras[select.value];
            }
        });
        return total;
    }

    function getPilotPoints(shipDiv) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        if (pilotSelect && pilotSelect.value) {
            return ships["ARC-170"][pilotSelect.value].cost;
        }
        return 0;
    }

    window.arc170Rules = {
        addShip: addShip,
        calculateUpgradePoints: calculateUpgradePoints,
        getPilotPoints: getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
