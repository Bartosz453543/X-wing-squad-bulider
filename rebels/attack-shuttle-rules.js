(function () {
    const ships = {
        "Attack Shuttle": {
            "Hera Syndulla":     {cost:42, talentSlots:1, turretSlots:1, crewSlots:1, modificationSlots:1, titleSlots:1, upgradeLimit:10},
            "Ezra Bridger":      {cost:39, forceSlots:1, turretSlots:1, crewSlots:1, modificationSlots:1, titleSlots:1, upgradeLimit:10},
            "Sabine Wren":       {cost:37, talentSlots:1, turretSlots:1, crewSlots:1, modificationSlots:1, titleSlots:1, upgradeLimit:10},
            "Zeb Orrelios":      {cost:36, talentSlots:1, turretSlots:1, crewSlots:1, modificationSlots:1, titleSlots:1, upgradeLimit:10}
        }
    };

    const shuttleExtras = {
        "Talent Upgrade": {"Veteran Instincts":3,"Outmaneuver":4},
        "Force Upgrade": {"Sense":4,"Supernatural Reflexes":6},
        "Crew Upgrade": {"Chewbacca":5,"L3-37":3},
        "Gunner Upgrade": {"Rebel Gunner":3},
        "Turret Upgrade": {"Dorsal Turret":4,"Ion Cannon Turret":5},
        "Modification Upgrade": {"Shield Upgrade":4,"Engine Upgrade":3},
        "Title Upgrade": {"Phantom":0}
    };

    function addShuttle() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section shuttle";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="Attack Shuttle">Attack Shuttle</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
        for (let pilot in ships["Attack Shuttle"]) {
            const cost = ships["Attack Shuttle"][pilot].cost;
            pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${cost} pkt)</option>`;
        }
        pilotSelect.onchange = () => updateShuttleUpgrades(shipDiv);
        shipDiv.appendChild(pilotSelect);

        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updateShuttleUpgrades(shipDiv);
    }

    function updateShuttleUpgrades(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        upgradeSection.innerHTML = "";
        pointsDiv.innerHTML = "";
        if (!pilot) return;

        const data = ships["Attack Shuttle"][pilot] || {};
        [
            ["Talent Upgrade",       data.talentSlots || 0],
            ["Force Upgrade",        data.forceSlots || 0],
            ["Crew Upgrade",         data.crewSlots || 0],
            ["Gunner Upgrade",       data.gunnerSlots || 0],
            ["Turret Upgrade",       data.turretSlots || 0],
            ["Modification Upgrade", data.modificationSlots || 0],
            ["Title Upgrade",        data.titleSlots || 0]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= count; i++) {
                createUpgradeSelect(upgradeSection, cat, shuttleExtras[cat], `No ${cat} (Slot ${i})`);
            }
        });

        updateShuttlePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value="">${defaultText}</option>`;
        for (let key in options) {
            select.innerHTML += `<option value="${key}">${key} (${options[key]} pkt)</option>`;
        }
        select.onchange = () => updateShuttlePointsDisplay(container.parentNode);
        container.appendChild(select);
    }

    function updateShuttlePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const points = calculateShuttlePoints(shipDiv);
        const limit = ships["Attack Shuttle"][pilot]?.upgradeLimit || 0;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateShuttlePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            return sum + (val && shuttleExtras[cat][val] || 0);
        }, 0);
    }

    function getShuttlePilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        return ships["Attack Shuttle"][pilot]?.cost || 0;
    }

    window.attackShuttleRules = {
        addShip: addShuttle,
        calculateUpgradePoints: calculateShuttlePoints,
        getPilotPoints: getShuttlePilotPoints,
        getUpgradePoints: calculateShuttlePoints
    };
})();
