(() => {
    const ships = {
        "Attack Shuttle": {
            "Hera Syndulla": { cost: 42, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Ezra Bridger":   { cost: 39, forceSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Sabine Wren":    { cost: 37, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 },
            "Zeb Orrelios":   { cost: 36, talentSlots: 1, turretSlots: 1, crewSlots: 1, modificationSlots: 1, titleSlots: 1, upgradeLimit: 10 }
        }
    };

    const shuttleExtras = {
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

    function updateShuttleUpgrades(shipDiv) {
        const pilot = shipDiv.querySelector('.pilot-select').value;
        const upgradeSection = shipDiv.querySelector('.upgrade-section');
        upgradeSection.innerHTML = '';
        if (!pilot) return;
        const data = ships['Attack Shuttle'][pilot] || {};
        [
            ['Talent Upgrade', data.talentSlots || 0],
            ['Force Upgrade', data.forceSlots || 0],
            ['Crew Upgrade', data.crewSlots || 0],
            ['Gunner Upgrade', data.gunnerSlots || 0],
            ['Turret Upgrade', data.turretSlots || 0],
            ['Modification Upgrade', data.modificationSlots || 0],
            ['Title Upgrade', data.titleSlots || 0]
        ].forEach(([cat, cnt]) => {
            for (let i = 1; i <= cnt; i++) {
                createUpgradeSelect(upgradeSection, cat, shuttleExtras[cat], `No ${cat} (Slot ${i})`);
            }
        });
        refreshCrewUpgradeOptions();
        updateShuttlePointsDisplay(shipDiv);
    }

    function calculateShuttlePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll('.upgrade-select')).reduce((sum, sel) => {
            return sum + (sel.value ? shuttleExtras[sel.dataset.category][sel.value] : 0);
        }, 0);
    }

    function updateShuttlePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector('.pilot-select').value;
        const used = calculateShuttlePoints(shipDiv);
        const limit = ships['Attack Shuttle'][pilot]?.upgradeLimit || 0;
        shipDiv.querySelector('.upgrade-points').innerText = `Użyte punkty: ${used} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function addShuttle() {
        const squad = document.getElementById('squadron');
        const shipDiv = document.createElement('div');
        shipDiv.className = 'ship-section shuttle';

        // Ship type
        const typeSel = document.createElement('select');
        typeSel.className = 'ship-select';
        typeSel.innerHTML = '<option value="Attack Shuttle">Attack Shuttle</option>';
        shipDiv.appendChild(typeSel);

        // Pilot
        const pilotSel = document.createElement('select');
        pilotSel.className = 'pilot-select';
        pilotSel.innerHTML = '<option value="">Select Pilot</option>' +
            Object.keys(ships['Attack Shuttle']).map(p => `<option value="${p}">${p} (${ships['Attack Shuttle'][p].cost} pkt)</option>`).join('');
        pilotSel.onchange = () => {
            updateShuttleUpgrades(shipDiv);
            refreshCrewUpgradeOptions();
        };
        shipDiv.appendChild(pilotSel);

        // Upgrades container
        const upgDiv = document.createElement('div');
        upgDiv.className = 'upgrade-section';
        shipDiv.appendChild(upgDiv);

        // Points display
        const ptsDiv = document.createElement('div');
        ptsDiv.className = 'upgrade-points';
        shipDiv.appendChild(ptsDiv);

    
        squad.appendChild(shipDiv);
        updateShuttleUpgrades(shipDiv);
        refreshCrewUpgradeOptions();
    }

    // Attach event delegation for any dynamic changes
    document.getElementById('squadron').addEventListener('change', event => {
        if (event.target.matches('.pilot-select, .upgrade-select')) {
            refreshCrewUpgradeOptions();
        }
    });

    window.attackShuttleRules = {
        addShip: addShuttle,
        calculateUpgradePoints: calculateShuttlePoints,
        getPilotPoints: shipDiv => ships['Attack Shuttle'][shipDiv.querySelector('.pilot-select').value]?.cost || 0,
        getUpgradePoints: calculateShuttlePoints
    };
})();
