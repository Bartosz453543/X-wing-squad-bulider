const z95Rules = (function () {
    const ships = { "Z-95 Headhunter": { 
        "Airen Cracken": { cost: 30, talentSlots: 1, torpedoSlots: 1, sensorSlots: 1, modificationSlots: 1, upgradeLimit: 8 },
        "Lieutenant Blount": { cost: 32, talentSlots: 1, missileSlots: 1, modificationSlots: 1, upgradeLimit: 8 },
        "Bandit Squadron Pilot": { cost: 25, missileSlots: 1, modificationSlots: 1, upgradeLimit: 6 },
        "Tala Squadron Pilot": { cost: 26, talentSlots: 1, missileSlots: 1, modificationSlots: 1, upgradeLimit: 6 }
    }};

    const upgrades = { 
        "Talent Upgrade": { "Outmaneuver": 4, "Swarm Tactics": 3 }, 
        "Missile Upgrade": { "Ion Missiles": 3, "Cluster Missiles": 4 }, 
        "Torpedo Upgrade": { "Proton Torpedoes": 5, "Adv. Proton Torpedoes": 6 },
        "Sensor Upgrade": { "Fire-Control System": 3, "Passive Sensors": 2 },
        "Modification Upgrade": { "Shield Upgrade": 4, "Stealth Device": 3 }
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
        for (let pilot in ships["Z-95 Headhunter"]) {
            pilotSelect.innerHTML += `<option value="${pilot}">${pilot}</option>`;
        }
        shipDiv.appendChild(pilotSelect);

        squadronDiv.appendChild(shipDiv);
    }

    function getPilotPoints(section) {
        const pilot = section.querySelector('.pilot-select')?.value || "";
        if (ships["Z-95 Headhunter"][pilot]) {
            return ships["Z-95 Headhunter"][pilot].cost;
        }
        return 0;
    }

    function getUpgradePoints(section) {
        return 0; 
    }

    return { addShip, getPilotPoints, getUpgradePoints };
})();
