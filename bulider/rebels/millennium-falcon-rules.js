(function () {
    const ships = {
        "Millennium Falcon": {
            "Han Solo": { cost: 75, talentSlots: 1, missileSlots: 1, crewSlots: 2, gunnerSlots: 1, modificationSlots: 2, titleSlots: 1, illicitSlots: 1, upgradeLimit: 16 },
            "Lando Calrissian": { cost: 75, talentSlots: 1, missileSlots: 1, crewSlots: 2, gunnerSlots: 1, modificationSlots: 2, titleSlots: 1, illicitSlots: 1, upgradeLimit: 16 },
            "Leia Organa": { cost: 75, forceSlots: 1, missileSlots: 1, crewSlots: 2, gunnerSlots: 1, modificationSlots: 2, titleSlots: 1, illicitSlots: 1, upgradeLimit: 16 },
            "Chewbacca": { cost: 75, talentSlots: 1, missileSlots: 1, crewSlots: 2, gunnerSlots: 1, modificationSlots: 2, titleSlots: 1, illicitSlots: 1, upgradeLimit: 16 },
            "Outer Rim Smuggler": { cost: 45, missileSlots: 1, crewSlots: 1, gunnerSlots: 1, modificationSlots: 1, upgradeLimit: 10 },
            "Han Solo Battle of Yavin": { cost: 75, upgradeLimit: 16 },
            "Lando Calrissian Battle Over Endor": { cost: 75, upgradeLimit: 16 }
        }
    };

    const mfExtras = {
        "Talent Upgrade": { "Veteran Instincts": 3, "Outmaneuver": 4, "Ace In the Hole": 1, "It's a Trap": 2 },
        "Missile Upgrade": { "Concussion Missiles": 3, "Seismic Charges": 4 },
        "Crew Upgrade": { "Chewbacca": 5, "L3-37": 3, "Nien Nunb": 2 },
        "Gunner Upgrade": { "Rebel Gunner": 3, "Airen Cracken": 2 },
        "Modification Upgrade": { "Shield Upgrade": 4, "Engine Upgrade": 3 },
        "Title Upgrade": { "Millennium Falcon": 0 },
        "Illicit Upgrade": { "Hondo Ohnaka": 4, "Hotshot Copilot": 3, "Rigged Cargo Chute": 1 },
        "Force Upgrade": { "Sense": 4, "Supernatural Reflexes": 6 },
        "Configuration Upgrade": { "L3-37 S": 3 }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section falcon";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="Millennium Falcon">Millennium Falcon</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
        for (let pilot in ships["Millennium Falcon"]) {
            const cost = ships["Millennium Falcon"][pilot].cost;
            pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${cost} pkt)</option>`;
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

        const data = ships["Millennium Falcon"][pilot];

        if (pilot === "Han Solo Battle of Yavin") {
            const presets = [
                ["Crew Upgrade", "Chewbacca"],
                ["Illicit Upgrade", "Rigged Cargo Chute"],
                ["Title Upgrade", "Millennium Falcon"],
                ["Configuration Upgrade", "L3-37 S"]
            ];
            let total = 0;
            presets.forEach(([cat, val]) => {
                const sel = document.createElement("select");
                sel.className = "upgrade-select";
                sel.disabled = true;
                sel.dataset.category = cat;
                sel.innerHTML = `<option>${val}</option>`;
                total += mfExtras[cat][val] || 0;
                upgradeSection.appendChild(sel);
            });
            pointsDiv.innerText = `Użyte punkty: ${total} / ${data.upgradeLimit}`;
            if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
            return;
        }

        if (pilot === "Lando Calrissian Battle Over Endor") {
            const presets = [
                ["Talent Upgrade", "Ace In the Hole"],
                ["Talent Upgrade", "It's a Trap"],
                ["Crew Upgrade", "Nien Nunb"],
                ["Gunner Upgrade", "Airen Cracken"],
                ["Title Upgrade", "Millennium Falcon"]
            ];
            let total = 0;
            presets.forEach(([cat, val]) => {
                const sel = document.createElement("select");
                sel.className = "upgrade-select";
                sel.disabled = true;
                sel.dataset.category = cat;
                sel.innerHTML = `<option>${val}</option>`;
                total += mfExtras[cat][val] || 0;
                upgradeSection.appendChild(sel);
            });
            pointsDiv.innerText = `Użyte punkty: ${total} / ${data.upgradeLimit}`;
            if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
            return;
        }

        [
            ["Talent Upgrade", data.talentSlots],
            ["Force Upgrade", data.forceSlots],
            ["Missile Upgrade", data.missileSlots],
            ["Crew Upgrade", data.crewSlots],
            ["Gunner Upgrade", data.gunnerSlots],
            ["Modification Upgrade", data.modificationSlots],
            ["Illicit Upgrade", data.illicitSlots],
            ["Configuration Upgrade", data.configurationSlots],
            ["Title Upgrade", data.titleSlots]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= (count || 0); i++) {
                createUpgradeSelect(upgradeSection, cat, mfExtras[cat], `No ${cat} (Slot ${i})`);
            }
        });

        updateUpgradePointsDisplay(shipDiv);
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value="">${defaultText}</option>`;
        for (let key in options) {
            select.innerHTML += `<option value="${key}">${key} (${options[key]} pkt)</option>`;
        }
        select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
        container.appendChild(select);
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        const points = calculateUpgradePoints(shipDiv);
        const limit = ships["Millennium Falcon"][pilot].upgradeLimit;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            return sum + (val && mfExtras[cat][val] || 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        return ships["Millennium Falcon"][pilot]?.cost || 0;
    }

    window.falconRules = { addShip, calculateUpgradePoints, getPilotPoints, getUpgradePoints: calculateUpgradePoints };
})();
