(function () {
    const ships = {
        "Attack Shuttle": {
            "Hera Syndulla": { cost: 42, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Ezra Bridger": { cost: 39, forceSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Sabine Wren": { cost: 37, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Zeb Orrelios": { cost: 36, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 }
        }
    };

    const shuttleExtras = {
        "Talent Upgrade":
        {
            "Composure": 1, "Deadeye Shot": 1, "Hopeful": 1, "Marg Sable Closure": 1,
            "Marksmanship": 2, "Debris Gambit": 3, "Lone Wolf": 3, "Predator": 3, "Elusive": 4,
            "Enduring": 4, "Selfess": 4, "Squad Leader": 4, "Trick a shot": 4, "Crack Shot": 5, "Intimidation": 7,
            "Juke": 7, "Snap shot": 7, "Swarm Tactics": 7, "Outmaneuver": 9
        },
        "Force Upgrade":
        {
            "Compassion": 1, "Predictive Shot": 1, "Brilliant Evasion": 2, "Instinctive Aim": 2, "Patience": 2,
            "Shattering Shot": 3, "Heightened Perception": 5,
            "Foresight": 6, "Sense": 10, "Precognitive Reflex": 15, "Supernatural Reflex": 24
        },
        "Crew Upgrade":
        {
            "Chopper": 1, "Zeb Orrelios": 1, "Lando Calrissian": 2, "Novice Technician": 2, "Tristan Wren": 2, "Chewbacca": 3,     // "Tactical Officer": 3, 
            "Freelance Slicer": 3, "Bo-Katan Kryze": 4, "Hera Syndulla": 4, "GNK “Gonk” Droid": 5, "Magva Yarro": 5, "Nien Nunb": 5,                  
            "Sabine Wren": 5, "Informant": 6, "Baze Malbus": 7,"C-3PO": 7, "Cassian Andor": 7, "Fenn Rau": 7,  "Jyn Erso": 7,
            "Leia Organa": 7, "Seasoned Navigator": 7, "The Child": 7,  "Hondo Ohnaka": 8, "K-2SO": 8, "Perceptive Copilot": 8, 
            "R2-D2": 8, "Ursa Wren": 6, "Saw Gerrera": 9, "Kanan Jarrus": 12, "Maul": 12
        },
        "Turret Upgrade":
        {
            "Dorsal Turret": 4, "Ion Cannon Turret": 5
        },
        "Modification Upgrade":
        {
            "Angled Deflectors": 1, "Delayed Fuses": 1, "Munitions Failsafe": 1, "Targeting Computer": 1,
            "Electronic Baffle": 2, "Afterburners": 8, "Hull Upgrade": 9, "Shield Upgrade": 10, "Static Descharge Vanes": 12
        },
        "Title Upgrade": { "Phantom": 0 }
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
            ["Talent Upgrade", data.talentSlots || 0],
            ["Force Upgrade", data.forceSlots || 0],
            ["Crew Upgrade", data.crewSlots || 0],
            ["Gunner Upgrade", data.gunnerSlots || 0],
            ["Turret Upgrade", data.turretSlots || 0],
            ["Modification Upgrade", data.modificationSlots || 0],
            ["Title Upgrade", data.titleSlots || 0]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= count; i++) {
                createUpgradeSelect(upgradeSection, cat, shuttleExtras[cat], `No ${cat} (Slot ${i})`, pilot);
            }
        });

        updateShuttlePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, options, defaultText, selectedPilot = "") {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value="">${defaultText}</option>`;

        for (let key in options) {
            if (category === "Crew Upgrade" && key === "Maul" && selectedPilot !== "Ezra Bridger") {
                continue; // ukryj Maula jeśli pilot to nie Ezra
            }
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
