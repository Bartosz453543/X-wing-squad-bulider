(function () {
    const ships = {
        "HWK-290": {
            "Jan Ors":{ cost: 36, talentSlots: 1, crewSlots: 1, turretSlots: 0, bombSlots: 2, illicitSlots: 0, modificationSlots: 2, titleSlots: 1, upgradeLimit: 12 },
            "Kyle Katarn":{ cost: 40, talentSlots: 2, crewSlots: 1, turretSlots: 0, bombSlots: 1, illicitSlots: 0, modificationSlots: 1, titleSlots: 1, upgradeLimit: 13 },
            "Roark Garnet":{ cost: 34, talentSlots: 1, crewSlots: 1, turretSlots: 0, bombSlots: 1, illicitSlots: 0, modificationSlots: 2, titleSlots: 1, upgradeLimit: 10 },
            "Rebel Scout":{ cost: 32, talentSlots: 0, crewSlots: 0, turretSlots: 0, bombSlots: 1, illicitSlots: 0, modificationSlots: 1, titleSlots: 0, upgradeLimit: 7 }
        }
    };

    const hwkExtras = {
        "Talent Upgrade":{ "Veteran Instincts": 3, "Outmaneuver": 4 },
        "Crew Upgrade":{ "Cassian Andor": 3, "K-2SO": 2 },
        "Turret Upgrade":{ "Dorsal Turret": 2, "Ion Cannon Turret": 3 },
        "Bomb Upgrade":{ "Proton Bombs": 4, "Seismic Charges": 3 },
        "Illicit Upgrade":{ "Contraband Cybernetics": 2, "Deadman's Switch": 3 },
        "Modification Upgrade":{ "Engine Upgrade": 3, "Shield Upgrade": 4 },
        "Title Upgrade":{ "Moldy Crow": 2 }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section hwk290";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value=\"HWK-290\">HWK-290</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value=\"\">Select Pilot</option>`;
        for (let pilot in ships["HWK-290"]) {
            const cost = ships["HWK-290"][pilot].cost;
            pilotSelect.innerHTML += `<option value=\"${pilot}\">${pilot} (${cost} pkt)</option>`;
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

        const data = ships["HWK-290"][pilot];
        [
            ["Talent Upgrade", data.talentSlots],
            ["Crew Upgrade", data.crewSlots],
            ["Turret Upgrade", data.turretSlots],
            ["Bomb Upgrade", data.bombSlots],
            ["Illicit Upgrade", data.illicitSlots],
            ["Modification Upgrade", data.modificationSlots],
            ["Title Upgrade", data.titleSlots]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= count; i++) {
                createUpgradeSelect(upgradeSection, cat, hwkExtras[cat], `No ${cat} (Slot ${i})`);
            }
        });

        updateUpgradePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value=\"\">${defaultText}</option>`;
        for (let key in options) {
            select.innerHTML += `<option value=\"${key}\">${key} (${options[key]} pkt)</option>`;
        }
        select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const points = calculateUpgradePoints(shipDiv);
        const limit = ships["HWK-290"][pilot].upgradeLimit;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            return sum + (val && hwkExtras[cat][val] || 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        return ships["HWK-290"][pilot]?.cost || 0;
    }

    window.hwk290Rules = { addShip, calculateUpgradePoints, getPilotPoints, getUpgradePoints: calculateUpgradePoints };
})();
