(function () {
    // Dane dla Rebel Fang Fighter – tablice/obiekty zapisane w wielu liniach
    const ships = {
        "Fang Fighter": {
            "Fenn Rau ": { cost: 5, talentSlots: 2, torpedoSlots: 1, modificationSlots: 2, upgradeLimit: 8 },
            "Bodica Venj ": { cost: 5, talentSlots: 2, torpedoSlots: 1, modificationSlots: 2, upgradeLimit: 8 },
            "Clan Wren Volunteer ": { cost: 4, talentSlots: 1, torpedoSlots: 1, modificationSlots: 2, upgradeLimit: 7 },
            "Dirk Ullodin": { cost: 4, talentSlots: 0, torpedoSlots: 1, modificationSlots: 2, upgradeLimit: 6 }
        }
    };

    // Kategorie ulepszeń
    const fangExtras = {
        "Talent Upgrade": 
        { 
             "Clan Traning" : 1,"Composure": 1, "Deadeye Shot" : 1, "Hopeful": 1, "Marg Sable Closure" : 1,      
             "Marksmanship": 2, "Debris Gambit" : 3,"Lone Wolf" : 3, "Predator": 3,"Daredevil" : 4, "Elusive": 4,
             "Enduring" : 4, "Selfess" : 4, "Squad Leader" : 4, "Trick a shot": 4, "Crack Shot" : 5, "Intimidation" : 7,
             "Juke" : 7, "Snap shot" : 7, "Swarm Tactics" : 7, "Outmaneuver" : 9
        },
        "Modification Upgrade": 
        { 
             "Delayed Fuses": 1, "Munitions Failsafe": 1, "Targeting Computer": 1, "Electronic Baffle": 2,
             "Mandaloiran Optics" : 3, "Beskar Reinforced Plating": 6,
             "Afterburners":8, "Hull Upgrade": 9, "Shield Upgrade": 10, "Static Descharge Vanes" : 12
        },
        "Torpedo Upgrade": 
        { 
            "Homing Torpedoes": 4,"Ion Torpedoes":5, "Plasma Torpedoes" : 7, "Adv Proton Torpedoes" : 9, "Proton Torpedoes" : 14
        }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section fangfighter";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="Fang Fighter">Fang Fighter</option>`;
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
        updatePilotOptions(shipDiv, "Fang Fighter");
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

        const pilotData = ships["Fang Fighter"][pilotSelect.value];

        if (pilotData.talentSlots) {
            for (let i = 1; i <= pilotData.talentSlots; i++) {
                createUpgradeSelect(upgradeSection, "Talent Upgrade", fangExtras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
            }
        }

        if (pilotData.torpedoSlots) {
            for (let i = 1; i <= pilotData.torpedoSlots; i++) {
                createUpgradeSelect(upgradeSection, "Torpedo Upgrade", fangExtras["Torpedo Upgrade"], `No Torpedo Upgrade (Slot ${i})`);
            }
        }

        if (pilotData.modificationSlots) {
            for (let i = 1; i <= pilotData.modificationSlots; i++) {
                createUpgradeSelect(upgradeSection, "Modification Upgrade", fangExtras["Modification Upgrade"], `No Modification Upgrade (Slot ${i})`);
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
        const upgradeLimit = ships["Fang Fighter"][pilotSelect.value]?.upgradeLimit || 0;
        pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
        if (typeof updateGlobalTotalPoints === 'function') { updateGlobalTotalPoints(); }
    }

    function calculateUpgradePoints(shipDiv) {
        let total = 0;
        const selects = shipDiv.querySelectorAll(".upgrade-select");
        selects.forEach(select => {
            const extras = fangExtras[select.dataset.category];
            if (select.value && extras && extras[select.value]) {
                total += extras[select.value];
            }
        });
        return total;
    }

    function getPilotPoints(shipDiv) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        if (pilotSelect && pilotSelect.value) {
            return ships["Fang Fighter"][pilotSelect.value].cost;
        }
        return 0;
    }

    window.fangfighterRules = {
        addShip: addShip,
        calculateUpgradePoints: calculateUpgradePoints,
        getPilotPoints: getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
