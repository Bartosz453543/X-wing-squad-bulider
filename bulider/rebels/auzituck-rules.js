(function () {
    // Dane dla Auzituck Gunship
    const ships = {
        "Auzituck Gunship": {
            "Lowhhrick":        { cost: 50, talentSlots: 1, crewSlots: 2, modificationSlots: 1, upgradeLimit: 9 },
            "Wullffwarro":      { cost: 49, talentSlots: 1, crewSlots: 2, modificationSlots: 0, upgradeLimit: 8 },
            "Kashyyyk Defender": { cost: 44, talentSlots: 0, crewSlots: 2, modificationSlots: 1, upgradeLimit: 7 }
        }
    };

    // Kategorie ulepszeń dla Auzituck Gunship
    const auzituckExtras = {
        "Talent Upgrade": {
            "Composure": 1, "Deadeye Shot": 1, "Hopeful": 1, "Marg Sable Closure": 1, "Expert Handling":2,
            "Marksmanship": 2, "Debris Gambit": 3, "Lone Wolf": 3, "Predator": 3, "Elusive": 4,
            "Enduring": 4, "Selfess": 4, "Squad Leader": 4, "Trick a shot": 4, "Crack Shot": 5, "Intimidation": 7,
            "Juke": 7, "Snap shot": 7, "Swarm Tactics": 7, "Outmaneuver": 9
        },
        "Crew Upgrade": {
            "Chopper": 1, "Zeb Orrelios": 1, "Lando Calrissian": 2, "Novice Technician": 2, "Tristan Wren": 2,
            "Chewbacca": 3, "Freelance Slicer": 3, "Bo-Katan Kryze": 4, "Hera Syndulla": 4, "GNK “Gonk” Droid": 5,
            "Magva Yarro": 5, "Nien Nunb": 5, "Sabine Wren": 5, "Informant": 6, "Baze Malbus": 7,
            "C-3PO": 7, "Cassian Andor": 7, "Fenn Rau": 7, "Jyn Erso": 7, "Leia Organa": 7,
            "Seasoned Navigator": 7, "The Child": 7, "Hondo Ohnaka": 8, "K-2SO": 8, "Perceptive Copilot": 8,
            "R2-D2": 8, "Ursa Wren": 6, "Saw Gerrera": 9, "Kanan Jarrus": 12, "Maul": 12
        },
        "Modification Upgrade": {
            "Angled Deflectors": 1, "Delayed Fuses": 1, "Munitions Failsafe": 1, "Targeting Computer": 1,
            "Electronic Baffle": 2, "Afterburners": 8, "Hull Upgrade": 9, "Shield Upgrade": 10, "Static Descharge Vanes": 12
        }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section auzituck";

        // Wybór statku
        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value=\"Auzituck Gunship\">Auzituck Gunship</option>`;
        shipDiv.appendChild(shipSelect);

        // Wybór pilota
        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
        pilotSelect.onchange = () => updateUpgrades(shipDiv);
        shipDiv.appendChild(pilotSelect);

        // Sekcja ulepszeń
        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        // Wyświetlacz punktów
        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updatePilotOptions(shipDiv);
    }
    function squadronHasEzra() {
        return Array.from(document.querySelectorAll('#squadron .ship-section')).some(ship => {
            // check pilot
            if (ship.querySelector('.pilot-select').value === 'Ezra Bridger') return true;
            // check gunner slots
            return Array.from(ship.querySelectorAll('.upgrade-select[data-category="Gunner Upgrade"]')).some(sel => sel.value === 'Ezra Bridger');
        });
    }

    function refreshCrewUpgradeOptions() {
        const ezraPresent = squadronHasEzra();
        document.querySelectorAll('.upgrade-select[data-category="Crew Upgrade"]').forEach(select => {
            const prev = select.value;
            select.innerHTML = `<option value="">${select.dataset.defaultText}</option>`;
            Object.keys(shuttleExtras['Crew Upgrade']).forEach(key => {
                if (key === 'Maul' && !ezraPresent) return;
                select.innerHTML += `<option value="${key}">${key} (${shuttleExtras['Crew Upgrade'][key]} pkt)</option>`;
            });
            if (!ezraPresent && prev === 'Maul') select.value = '';
            else select.value = prev;
        });
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const select = document.createElement('select');
        select.className = 'upgrade-select';
        select.dataset.category = category;
        select.dataset.defaultText = defaultText;
        select.innerHTML = `<option value="">${defaultText}</option>`;
        const ezraPresent = squadronHasEzra();
        Object.entries(options).forEach(([key, pts]) => {
            if (category === 'Crew Upgrade' && key === 'Maul' && !ezraPresent) return;
            select.innerHTML += `<option value="${key}">${key} (${pts} pkt)</option>`;
        });
        select.onchange = () => {
            if (category === 'Gunner Upgrade') refreshCrewUpgradeOptions();
            updateShuttlePointsDisplay(container.parentNode);
        };
        container.appendChild(select);
    }
    function updatePilotOptions(shipDiv) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
        Object.entries(ships["Auzituck Gunship"]).forEach(([pilot, data]) => {
            pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${data.cost} pkt)</option>`;
        });
        updateUpgrades(shipDiv);
    }

    function updateUpgrades(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const upSec = shipDiv.querySelector(".upgrade-section");
        upSec.innerHTML = "";
        if (!pilot) {
            shipDiv.querySelector(".upgrade-points").innerText = "Użyte punkty: 0 / -";
            return;
        }

        const data = ships["Auzituck Gunship"][pilot];
        // Tworzenie slotów
        for (let i = 1; i <= data.talentSlots; i++) {
            createUpgradeSelect(upSec, "Talent Upgrade", auzituckExtras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
        }
        for (let i = 1; i <= data.crewSlots; i++) {
            createUpgradeSelect(upSec, "Crew Upgrade", auzituckExtras["Crew Upgrade"], `No Crew Upgrade (Slot ${i})`);
        }
        for (let i = 1; i <= data.modificationSlots; i++) {
            createUpgradeSelect(upSec, "Modification Upgrade", auzituckExtras["Modification Upgrade"], `No Modification Upgrade (Slot ${i})`);
        }

        updateUpgradePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, optionsObj, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.dataset.defaultText = defaultText;
        select.innerHTML = `<option value=''>${defaultText}</option>`;
        Object.entries(optionsObj).forEach(([key, pts]) => {
            select.innerHTML += `<option value='${key}'>${key} (${pts} pkt)</option>`;
        });
        select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
        container.appendChild(select);
        return select;
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const used = calculateUpgradePoints(shipDiv);
        const limit = ships["Auzituck Gunship"][pilot]?.upgradeLimit || 0;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${used} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const cat = sel.dataset.category;
            const val = sel.value;
            return sum + (val ? auzituckExtras[cat][val] : 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        return ships["Auzituck Gunship"][pilot]?.cost || 0;
    }

    window.auzituckRules = {
        addShip,
        calculateUpgradePoints,
        getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
