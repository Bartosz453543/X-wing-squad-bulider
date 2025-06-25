(function () {
    const ships = {
        "Attack Shuttle": {
            "Hera Syndulla": { cost: 42, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Ezra Bridger":   { cost: 39, forceSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Sabine Wren":    { cost: 37, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Zeb Orrelios":   { cost: 36, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 }
        }
    };

    const attackShuttleExtras = {
        "Talent Upgrade": {
            "Composure": 1, "Deadeye Shot": 1, "Hopeful": 1, "Marg Sable Closure": 1,
            "Marksmanship": 2, "Debris Gambit": 3, "Lone Wolf": 3, "Predator": 3, "Elusive": 4,
            "Enduring": 4, "Selfess": 4, "Squad Leader": 4, "Trick a shot": 4, "Crack Shot": 5, "Intimidation": 7,
            "Juke": 7, "Snap shot": 7, "Swarm Tactics": 7, "Outmaneuver": 9
        },
        "Force Upgrade": {
            "Compassion": 1, "Predictive Shot": 1, "Brilliant Evasion": 2, "Instinctive Aim": 2, "Patience": 2,
            "Shattering Shot": 3, "Heightened Perception": 5,
            "Foresight": 6, "Sense": 10, "Precognitive Reflex": 15, "Supernatural Reflex": 24
        },
        "Crew Upgrade": {
            "Chopper": 1, "Zeb Orrelios": 1, "Lando Calrissian": 2, "Novice Technician": 2, "Tristan Wren": 2, "Chewbacca": 3,
            "Freelance Slicer": 3, "Bo-Katan Kryze": 4, "Hera Syndulla": 4, "GNK “Gonk” Droid": 5, "Magva Yarro": 5, "Nien Nunb": 5,
            "Sabine Wren": 5, "Informant": 6, "Baze Malbus": 7, "C-3PO": 7, "Cassian Andor": 7, "Fenn Rau": 7, "Jyn Erso": 7,
            "Leia Organa": 7, "Seasoned Navigator": 7, "The Child": 7, "Hondo Ohnaka": 8, "K-2SO": 8, "Perceptive Copilot": 8,
            "R2-D2": 8, "Ursa Wren": 6, "Saw Gerrera": 9, "Kanan Jarrus": 12, "Maul": 12
        },
        "Turret Upgrade": {
            "Dorsal Turret": 4, "Ion Cannon Turret": 5
        },
        "Modification Upgrade": {
            "Angled Deflectors": 1, "Delayed Fuses": 1, "Munitions Failsafe": 1, "Targeting Computer": 1,
            "Electronic Baffle": 2, "Afterburners": 8, "Hull Upgrade": 9, "Shield Upgrade": 10, "Static Descharge Vanes": 12
        },
        "Title Upgrade": { "Phantom": 0 }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section attack-shuttle";

        // Ship selector
        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="Attack Shuttle">Attack Shuttle</option>`;
        shipDiv.appendChild(shipSelect);

        // Pilot selector
        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
        pilotSelect.onchange = () => updateUpgrades(shipDiv);
        shipDiv.appendChild(pilotSelect);

        // Upgrades & points
        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updatePilotOptions(shipDiv, "Attack Shuttle");
    }

    function updatePilotOptions(shipDiv, selectedShip) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
        for (let pilot in ships[selectedShip]) {
            const p = ships[selectedShip][pilot];
            pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${p.cost} pkt)</option>`;
        }
        updateUpgrades(shipDiv);
    }

    function isEzraBridgerSelectedElsewhere(currentShipDiv) {
        const allShips = Array.from(document.querySelectorAll(".ship-section"));
        for (const ship of allShips) {
            if (ship === currentShipDiv) continue;

            const pilot = ship.querySelector(".pilot-select")?.value;
            if (pilot === "Ezra Bridger") return true;

            const upgradeSelects = ship.querySelectorAll(".upgrade-select");
            for (const select of upgradeSelects) {
                if (select.dataset.category === "Gunner Upgrade" && select.value === "Ezra Bridger") {
                    return true;
                }
            }
        }
        return false;
    }

    function updateUpgrades(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        upgradeSection.innerHTML = "";
        if (!pilot) return;

        const pilotData = ships["Attack Shuttle"][pilot];
        const ezraSelectedElsewhere = isEzraBridgerSelectedElsewhere(shipDiv);

        // Talent
        if (pilotData.talentSlots) {
            for (let i = 1; i <= pilotData.talentSlots; i++) {
                createUpgradeSelect(upgradeSection, "Talent Upgrade", attackShuttleExtras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
            }
        }

        // Force
        if (pilotData.forceSlots) {
            for (let i = 1; i <= pilotData.forceSlots; i++) {
                createUpgradeSelect(upgradeSection, "Force Upgrade", attackShuttleExtras["Force Upgrade"], `No Force Upgrade (Slot ${i})`);
            }
        }

        // Crew (Maul only if Ezra is somewhere)
        if (pilotData.crewSlots) {
            const baseCrew = { ...attackShuttleExtras["Crew Upgrade"] };
            if (!ezraSelectedElsewhere && pilot !== "Ezra Bridger") {
                delete baseCrew["Maul"];
            }
            for (let i = 1; i <= pilotData.crewSlots; i++) {
                createUpgradeSelect(upgradeSection, "Crew Upgrade", baseCrew, `No Crew Upgrade (Slot ${i})`);
            }
        }

        // Turret
        if (pilotData.turretSlots) {
            for (let i = 1; i <= pilotData.turretSlots; i++) {
                createUpgradeSelect(upgradeSection, "Turret Upgrade", attackShuttleExtras["Turret Upgrade"], `No Turret Upgrade (Slot ${i})`);
            }
        }

        // Modification
        if (pilotData.modificationSlots) {
            for (let i = 1; i <= pilotData.modificationSlots; i++) {
                createUpgradeSelect(upgradeSection, "Modification Upgrade", attackShuttleExtras["Modification Upgrade"], `No Modification (Slot ${i})`);
            }
        }

        // Title
        if (pilotData.titleSlots) {
            for (let i = 1; i <= pilotData.titleSlots; i++) {
                createUpgradeSelect(upgradeSection, "Title Upgrade", attackShuttleExtras["Title Upgrade"], `No Title Upgrade (Slot ${i})`);
            }
        }

        updateUpgradePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, optionsObj, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value=''>${defaultText}</option>`;
        for (const [upgrade, cost] of Object.entries(optionsObj)) {
            select.innerHTML += `<option value='${upgrade}'>${upgrade} (${cost} pkt)</option>`;
        }
        select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        const upgradePoints = calculateUpgradePoints(shipDiv);
        const upgradeLimit = ships["Attack Shuttle"][pilotSelect.value]?.upgradeLimit || 0;
        pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
        if (typeof updateGlobalTotalPoints === 'function') {
            updateGlobalTotalPoints();
        }
    }

    function calculateUpgradePoints(shipDiv) {
        let total = 0;
        shipDiv.querySelectorAll(".upgrade-select").forEach(select => {
            const extras = attackShuttleExtras[select.dataset.category];
            if (select.value && extras?.[select.value]) {
                total += extras[select.value];
            }
        });
        return total;
    }

    function getPilotPoints(shipDiv) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        return ships["Attack Shuttle"][pilotSelect.value]?.cost || 0;
    }

    window.attackShuttleRules = {
        addShip,
        calculateUpgradePoints,
        getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
