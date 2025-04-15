(function () {
    // Dane dla Auzituck Gunship
    const ships = {
        "Auzituck Gunship": {
            "Lowhhrick": { cost: 50, talentSlots: 1, crewSlots: 2, modificationSlots: 1, upgradeLimit: 9 },
            "Wullffwarro": { cost: 49, talentSlots: 1, crewSlots: 2, modificationSlots: 0, upgradeLimit: 8 },
            "Kashyyyk Defender": { cost: 44, talentSlots: 0, crewSlots: 2, modificationSlots: 1, upgradeLimit: 7 }
        }
    };

    // Kategorie ulepszeń
    const auzituckExtras = {
        "Talent Upgrade": { "Selfless": 3, "Elusive": 2 },
        "Crew Upgrade": { "C-3PO": 6, "Chewbacca": 5, "Leia Organa": 6 },
        "Modification Upgrade": { "Hull Upgrade": 4, "Shield Upgrade": 6 }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section auzituck";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="Auzituck Gunship">Auzituck Gunship</option>`;
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
        updatePilotOptions(shipDiv, "Auzituck Gunship");
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

        const pilotData = ships["Auzituck Gunship"][pilotSelect.value];

        // Ulepszenia talentów
        if (pilotData.talentSlots) {
            for (let i = 1; i <= pilotData.talentSlots; i++) {
                createUpgradeSelect(upgradeSection, "Talent Upgrade", auzituckExtras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
            }
        }
        // Ulepszenia załogi
        if (pilotData.crewSlots) {
            for (let i = 1; i <= pilotData.crewSlots; i++) {
                createUpgradeSelect(upgradeSection, "Crew Upgrade", auzituckExtras["Crew Upgrade"], `No Crew Upgrade (Slot ${i})`);
            }
        }
        // Ulepszenia modyfikacji
        if (pilotData.modificationSlots) {
            for (let i = 1; i <= pilotData.modificationSlots; i++) {
                createUpgradeSelect(upgradeSection, "Modification Upgrade", auzituckExtras["Modification Upgrade"], `No Modification Upgrade (Slot ${i})`);
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
        const upgradeLimit = ships["Auzituck Gunship"][pilotSelect.value]?.upgradeLimit || 0;
        pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
        if (typeof updateGlobalTotalPoints === 'function') { updateGlobalTotalPoints(); }
    }

    function calculateUpgradePoints(shipDiv) {
        let total = 0;
        const selects = shipDiv.querySelectorAll(".upgrade-select");
        selects.forEach(select => {
            const extras = auzituckExtras[select.dataset.category];
            if (select.value && extras && extras[select.value]) {
                total += extras[select.value];
            }
        });
        return total;
    }

    function getPilotPoints(shipDiv) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        if (pilotSelect && pilotSelect.value) {
            return ships["Auzituck Gunship"][pilotSelect.value].cost;
        }
        return 0;
    }

    window.auzituckRules = {
        addShip: addShip,
        calculateUpgradePoints: calculateUpgradePoints,
        getPilotPoints: getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
