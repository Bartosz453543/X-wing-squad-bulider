(function () {
    const ships = {
        "Gauntlet Fighter": {
            "Ezra Bridger": { cost: 56, forceSlots: 2, crewSlots: 1, gunnerSlots: 1, bombSlots: 1, illicitSlots: 1, modificationSlots: 2, configurationSlots: 1, titleSlots: 1, upgradeLimit: 13 },
            "Chopper": { cost: 50, forceSlots: 0, crewSlots: 1, gunnerSlots: 1, bombSlots: 1, illicitSlots: 1, modificationSlots: 2, configurationSlots: 1, titleSlots: 1, upgradeLimit: 12 },
            "Mandalorian Resistance Pilot": { cost: 47, forceSlots: 0, talentSlots: 1, crewSlots: 1, gunnerSlots: 1, bombSlots: 1, illicitSlots: 1, modificationSlots: 1, configurationSlots: 1, titleSlots: 0, upgradeLimit: 9 }
        }
    };

    const gauntletExtras = {
        "Force Upgrade": {
            "Compassion": 1, "Predictive Shot": 1, "Brilliant Evasion": 2, "Instinctive Aim": 2, "Patience": 2,
            "Shattering Shot": 3, "Extreme Maneuvers": 5, "Heightened Perception": 5,
            "Foresight": 6, "Sense": 10, "Precognitive Reflex": 15, "Supernatural Reflex": 24
        },
        "Crew Upgrade": {
            "Chopper": 1, "Zeb Orrelios": 1, "Lando Calrissian": 2, "Novice Technician": 2, "Tristan Wren": 2,
            "Chewbacca": 3, "Freelance Slicer": 3, "Bo-Katan Kryze": 4, "Hera Syndulla": 4, "GNK “Gonk” Droid": 5,
            "Magva Yarro": 5, "Nien Nunb": 5, "Sabine Wren": 5, "Informant": 6, "Baze Malbus": 7,
            "C-3PO": 7, "Cassian Andor": 7, "Fenn Rau": 7, "Jyn Erso": 7, "Leia Organa": 7,
            "Seasoned Navigator": 7, "The Child": 7, "Hondo Ohnaka": 8, "K-2SO": 8, "Perceptive Copilot": 8,
            "R2-D2": 8, "Ursa Wren": 6, "Saw Gerrera": 9, "Kanan Jarrus": 12, "Maul": 12
        },
        "Gunner Upgrade": {
            "Sabine Wren": 2, "Skilled Bombardier": 2, "Agile Gunner": 4, "Hotshot Gunner": 5,
            "Veteran Tail Gunner": 6, "Suppressive Gunner": 7, "Ezra Bridger": 9, "Han Solo": 10, "Bistan": 12,
            "Luke Skywalker": 12
        },
        "Bomb Upgrade": {
            "Seismic Charges": 3, "Ion Bombs": 4, "Blazer Bomb": 5, "Concussion Bombs": 5,
            "Conner Net": 4, "Proton Bombs": 5, "Thermal Detonators": 3, "Cluster Mines": 4,
            "Electro-Proton Bomb": 8, "Proximity Mines": 3
        },
        "Illicit Upgrade": {
            "Deadman's Switch": 2, "Contraband Cybernetics": 3, "Overtuned Modulators": 3, "Feedback Array": 4,
            "False Transponder Codes": 5, "Cloaking Device": 8, "Inertial Dampeners": 8
        },
        "Modification Upgrade": {
            "Delayed Fuses": 1, "Munitions Failsafe": 1, "Targeting Computer": 1, "Ablative Plating": 2,
            "Drop-Seat Bay": 2, "Electronic Baffle": 2, "Tactical Scrambler": 2, "Stealth Device": 8,
            "Hull Upgrade": 9, "Shield Upgrade": 10, "Static Discharge Vanes": 12
        },
        "Configuration Upgrade": { "Swivel Wing": 0 },
        "Title Upgrade": { "Nightbrother": 1 },
        "Talent Upgrade": {
            "Clan Training": 1, "Hopeful": 1, "Marksmanship": 2, "Lone Wolf": 3, "Predator": 3,
            "Enduring": 4, "Selfless": 4, "Squad Leader": 4, "Trick Shot": 4, "Crack Shot": 5,
            "Snap Shot": 7, "Swarm Tactics": 7, "Outmaneuver": 9
        }
    };

    const conditionalModifications = {
        "Mandalorian Resistance Pilot": {
            "Mandaloiran Optics": 3,
            "Beskar Reinforced Plating": 6
        }
    };

    function squadronHasEzra() {
        return Array.from(document.querySelectorAll('#squadron .ship-section')).some(ship => {
            if (ship.querySelector('.pilot-select').value === 'Ezra Bridger') return true;
            return Array.from(ship.querySelectorAll('.upgrade-select[data-category="Gunner Upgrade"]'))
                .some(sel => sel.value === 'Ezra Bridger');
        });
    }

    function squadronHasMaul() {
        return Array.from(document.querySelectorAll('#squadron .upgrade-select[data-category="Crew Upgrade"]'))
            .some(sel => sel.value === 'Maul');
    }

    function refreshCrewUpgradeOptions() {
        const ezraPresent = squadronHasEzra();
        document.querySelectorAll('.upgrade-select[data-category="Crew Upgrade"]').forEach(select => {
            const prev = select.value;
            select.innerHTML = `<option value="">${select.dataset.defaultText}</option>`;
            Object.keys(gauntletExtras['Crew Upgrade']).forEach(key => {
                if (key === 'Maul' && !ezraPresent) return;
                select.innerHTML += `<option value="${key}">${key} (${gauntletExtras['Crew Upgrade'][key]} pkt)</option>`;
            });
            select.value = (prev && select.querySelector(`option[value="${prev}"]`)) ? prev : '';
        });
    }

    function refreshForceUpgradeOptions() {
        const maulSelected = squadronHasMaul();
        document.querySelectorAll('.upgrade-select[data-category="Force Upgrade"]').forEach(select => {
            const prev = select.value;
            select.innerHTML = `<option value="">${select.dataset.defaultText}</option>`;
            Object.entries(gauntletExtras['Force Upgrade']).forEach(([key, pts]) => {
                select.innerHTML += `<option value="${key}">${key} (${pts} pkt)</option>`;
            });
            if (maulSelected) {
                select.innerHTML += `<option value="Malice">Malice (4 pkt)</option>`;
                select.innerHTML += `<option value="Hate">Hate (5 pkt)</option>`;
            }
            select.value = (prev && select.querySelector(`option[value="${prev}"]`)) ? prev : '';
        });
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const select = document.createElement('select');
        select.className = 'upgrade-select';
        select.dataset.category = category;
        select.dataset.defaultText = defaultText;
        select.innerHTML = `<option value="">${defaultText}</option>`;

        const ezraPresent = squadronHasEzra();
        const pilot = container.closest('.ship-section').querySelector('.pilot-select')?.value;

        const extraMods = (category === 'Modification Upgrade' && pilot && conditionalModifications[pilot]) ? conditionalModifications[pilot] : {};
        const combinedOptions = { ...options, ...extraMods };

        Object.entries(combinedOptions).forEach(([key, pts]) => {
            if (category === 'Crew Upgrade' && key === 'Maul' && !ezraPresent) return;
            select.innerHTML += `<option value="${key}">${key} (${pts} pkt)</option>`;
        });

        select.onchange = () => {
            if (category === 'Gunner Upgrade') refreshCrewUpgradeOptions();
            if (category === 'Crew Upgrade') {
                refreshCrewUpgradeOptions();
                refreshForceUpgradeOptions();
            }
            updateUpgradePointsDisplay(container.parentNode);
        };

        container.appendChild(select);
    }

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section gauntlet";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="Gauntlet Fighter">Gauntlet Fighter</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
        for (let ship in ships) {
            for (let pilot in ships[ship]) {
                const cost = ships[ship][pilot].cost;
                pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${cost} pkt)</option>`;
            }
        }
        pilotSelect.onchange = () => updateUpgrades(shipDiv);
        shipDiv.appendChild(pilotSelect);

        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updateUpgrades(shipDiv);
    }

    function updateUpgrades(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        upgradeSection.innerHTML = "";
        pointsDiv.innerHTML = "";
        if (!pilot) return;

        const shipName = shipDiv.querySelector(".ship-select").value;
        const data = ships[shipName][pilot];

        [
            ["Force Upgrade", data.forceSlots],
            ["Talent Upgrade", data.talentSlots || 0],
            ["Crew Upgrade", data.crewSlots],
            ["Gunner Upgrade", data.gunnerSlots],
            ["Bomb Upgrade", data.bombSlots],
            ["Illicit Upgrade", data.illicitSlots],
            ["Modification Upgrade", data.modificationSlots],
            ["Configuration Upgrade", data.configurationSlots],
            ["Title Upgrade", data.titleSlots]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= count; i++) {
                createUpgradeSelect(upgradeSection, cat, gauntletExtras[cat], `No ${cat} (Slot ${i})`);
            }
        });

        refreshForceUpgradeOptions();
        updateUpgradePointsDisplay(shipDiv);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const points = calculateUpgradePoints(shipDiv);
        const shipName = shipDiv.querySelector(".ship-select").value;
        const limit = ships[shipName][pilot].upgradeLimit;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            if (val === "Malice") return sum + 4;
            if (val === "Hate") return sum + 5;
            return sum + (val && (gauntletExtras[cat]?.[val] ?? conditionalModifications["Mandalorian Resistance Pilot"]?.[val]) || 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const shipName = shipDiv.querySelector(".ship-select").value;
        return ships[shipName][pilot]?.cost || 0;
    }

    window.gauntletRules = {
        addShip,
        calculateUpgradePoints,
        getPilotPoints,
        getUpgradePoints: calculateUpgradePoints
    };
})();
