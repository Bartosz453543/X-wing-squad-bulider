(function () {
    const ships = {
        "Z-95 Headhunter": {
            "Airen Cracken":{ cost: 30, talentSlots: 1, torpedoSlots: 1, sensorSlots: 1, modificationSlots: 1, upgradeLimit: 8 },
            "Lieutenant Blount": { cost: 32, talentSlots: 2, missileSlots: 1, modificationSlots: 2, upgradeLimit: 8 },
            "Bandit Squadron Pilot": { cost: 25, missileSlots: 1, modificationSlots: 1, upgradeLimit: 6 },
            "Tala Squadron Pilot": { cost: 26, talentSlots: 1, modificationSlots: 1, upgradeLimit: 6 }
        }
    };

    const z95Extras = {
        "Talent": { "Outmaneuver": 4, "Swarm Tactics": 3 },
        "Missile": { "Ion Missiles": 3, "Cluster Missiles": 4 },
        "Torpedo": { "Proton Torpedoes": 5, "Adv. Proton Torpedoes": 6 },
        "Sensor": { "Fire-Control System": 3, "Passive Sensors": 2 },
        "Modification": { "Shield Upgrade": 4, "Stealth Device": 3 }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section z95";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="Z-95 Headhunter">Z-95 Headhunter</option>`;
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
        updatePilotOptions(shipDiv, "Z-95 Headhunter");
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
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        upgradeSection.innerHTML = "";
        pointsDiv.innerHTML = "";
        if (!pilot) return;

        const data = ships["Z-95 Headhunter"][pilot];
        [
            ["Talent", data.talentSlots],
            ["Missile", data.missileSlots],
            ["Torpedo", data.torpedoSlots],
            ["Sensor", data.sensorSlots],
            ["Modification", data.modificationSlots]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= (count || 0); i++) {
                createUpgradeSelect(upgradeSection, cat, z95Extras[cat], `No ${cat} (Slot ${i})`);
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
        const limit = ships["Z-95 Headhunter"][pilot].upgradeLimit;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            return sum + (val && z95Extras[cat][val] || 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        return ships["Z-95 Headhunter"][pilot]?.cost || 0;
    }

    window.z95Rules = {
        addShip,
        calculateUpgradePoints,
        getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
