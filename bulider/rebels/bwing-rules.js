(function () {
    const ships = {
        "B-Wing": {
            "Hera Syndulla":     {cost:7, talentSlots:1, sensorSlots:1, cannonSlots:2, torpedoSlots:1, missileSlots:1, bombSlots:1, modificationSlots:1, titleSlots:1, configurationSlots:1, upgradeLimit:12},
            "Gina Moonsong":     {cost:6, talentSlots:1, sensorSlots:1, cannonSlots:2, torpedoSlots:1, missileSlots:0, bombSlots:1, modificationSlots:1, titleSlots:0, configurationSlots:1, upgradeLimit:11},
            "Gina Moonsong Battle Over Endor": {cost:6, talentSlots:2, sensorSlots:1, cannonSlots:2, torpedoSlots:1, missileSlots:0, bombSlots:1, modificationSlots:1, titleSlots:0, configurationSlots:1, upgradeLimit:13},
            "Braylen Stramma":   {cost:6, talentSlots:1, sensorSlots:1, cannonSlots:2, torpedoSlots:1, missileSlots:0, bombSlots:1, modificationSlots:1, titleSlots:0, configurationSlots:1, upgradeLimit:11},
            "Braylen Stramma Battle Over Endor": {cost:6, talentSlots:1, sensorSlots:1, cannonSlots:2, torpedoSlots:0, missileSlots:1, bombSlots:1, modificationSlots:1, titleSlots:0, configurationSlots:1, upgradeLimit:11},
            "Adon Fox Battle Over Endor": {cost:6, talentSlots:2, sensorSlots:1, cannonSlots:2, torpedoSlots:0, missileSlots:1, bombSlots:1, modificationSlots:1, titleSlots:0, configurationSlots:1, upgradeLimit:12},
            "Ten Numb":          {cost:6, talentSlots:1, sensorSlots:1, cannonSlots:2, torpedoSlots:1, missileSlots:0, bombSlots:1, modificationSlots:1, titleSlots:0, configurationSlots:1, upgradeLimit:11},
            "Netrem Pollard":    {cost:6, talentSlots:1, sensorSlots:1, cannonSlots:2, torpedoSlots:0, missileSlots:1, bombSlots:1, modificationSlots:1, titleSlots:0, configurationSlots:1, upgradeLimit:11},
            "Blade Squadron Veteran": {cost:5, talentSlots:0, sensorSlots:2, cannonSlots:2, torpedoSlots:1, missileSlots:0, bombSlots:0, modificationSlots:0, titleSlots:0, configurationSlots:1, upgradeLimit:10},
            "Blue Squadron Pilot":    {cost:5, talentSlots:0, sensorSlots:2, cannonSlots:2, torpedoSlots:0, missileSlots:0, bombSlots:1, modificationSlots:0, titleSlots:0, configurationSlots:1, upgradeLimit:10}
        }
    };

    const bwingExtras = {
        "Talent": {
            "Composure":1, "Deadeye Shot":1, "Hopeful":1, "Marg Sable Closure":1,
            "Marksmanship":2, "Debris Gambit":3, "Lone Wolf":3, "Predator":3, "Elusive":4,
            "Enduring":4, "Saturation Salvo":4, "Selfess":4, "Squad Leader":4, "Trick a shot":4, "Crack Shot":5, "Intimidation":7,
            "Juke":7, "Snap shot":7, "Swarm Tactics":7, "Outmaneuver":9
        },
        "Sensor": {
            "Fire-Control System":2, "Passive Sensors":5, "Collision Detector":7, "Advanced Sensors":8, "Trajectory Simulator":10
        },
        "Cannon": {
            "Jamming Beam":1, "Heavy Laser Cannon":5, "Proton Cannons":5, "Ion Cannon":6,
            "Synced Laser Cannons":6, "Tractor Beam":6, "Autoblasters":7
        },
        "Torpedo": {
            "Homing Torpedoes":4, "Ion Torpedoes":5, "Plasma Torpedoes":7, "Adv Proton Torpedoes":9, "Proton Torpedoes":14
        },
        "Missile": {
            "Ion Missiles":3, "XX-23 S-Thread Tracers":4, "Homing Missiles":5,
            "Cluster Missiles":6, "Proton Rocket":6, "Concussion Missiles":7,
            "Mag-Pulse Warheads":7, "Electro-Chaff Missiles":11
        },
        "Bomb": {
            "Seismic Charges":3, "Ion Bombs":4, "Blazer Bomb":5, "Concussion Bombs":5,
            "Conner Net":4, "Proton Bombs":5, "Thermal Detonators":3, "Cluster Mines":4,
            "Electro-Proton Bomb":8, "Proximity Mines":3
        },
        "Modification": {
            "Angled Deflectors":1, "Delayed Fuses":1, "Munitions Failsafe":1,
            "Targeting Computer":1, "Electronic Baffle":2, "Afterburners":8,
            "Hull Upgrade":9, "Shield Upgrade":10, "Static Descharge Vanes":12
        },
        "Title": {
            "B6 Blade Wing Prototype":2
        },
        "Gunner Upgrade": {
            "Sabine Wren":2, "Skilled Bombardier":2, "Agile Gunner":4, "Hotshot Gunner":5,
            "Veteran Tail Gunner":6, "Suppressive Gunner":7, "Ezra Bridger":9,
            "Han Solo":10, "Bistan":12, "Luke Skywalker":12
        },
        "Configuration": {
            "Stabilized S-Foils":2
        }
    };

    function addShip() {
        const sq = document.getElementById("squadron");
        const div = document.createElement("div");
        div.className = "ship-section bwing";

        const shipSel = document.createElement("select");
        shipSel.className = "ship-select";
        shipSel.innerHTML = `<option value="B-Wing">B-Wing</option>`;
        div.appendChild(shipSel);

        const pilotSel = document.createElement("select");
        pilotSel.className = "pilot-select";
        pilotSel.innerHTML = `<option value="">Select Pilot</option>`;
        pilotSel.onchange = () => {
            updateUpgrades(div);
            updateUpgradePointsDisplay(div);
        };
        div.appendChild(pilotSel);

        const upgrades = document.createElement("div");
        upgrades.className = "upgrade-section";
        div.appendChild(upgrades);

        const pts = document.createElement("div");
        pts.className = "upgrade-points";
        div.appendChild(pts);

        sq.appendChild(div);
        updatePilotOptions(div, "B-Wing");
    }

    function updatePilotOptions(div, ship) {
        const pilotSel = div.querySelector(".pilot-select");
        pilotSel.innerHTML = `<option value="">Select Pilot</option>`;
        Object.keys(ships[ship]).forEach(p => {
            const cost = ships[ship][p].cost;
            pilotSel.innerHTML += `<option value="${p}">${p} (${cost} pkt)</option>`;
        });
        updateUpgrades(div);
        updateUpgradePointsDisplay(div);
    }

    function updateUpgrades(div) {
        const pilot = div.querySelector(".pilot-select").value;
        const upSec = div.querySelector(".upgrade-section");
        const pts   = div.querySelector(".upgrade-points");
        upSec.innerHTML = "";
        pts.innerHTML   = "";
        if (!pilot) return;

        const data = ships["B-Wing"][pilot];
        const presets = {
            "Gina Moonsong Battle Over Endor": [
                ["Talent","It's a Trap"],["Talent","Juke"],
                ["Torpedo","Proton Torpedoes"],["Bomb","Ion Bombs"]
            ],
            "Braylen Stramma Battle Over Endor": [
                ["Talent","It's a Trap"],["Missile","Homing Missiles"],
                ["Bomb","Proton Bombs"],["Modification","Delayed Fuses"]
            ],
            "Adon Fox Battle Over Endor": [
                ["Talent","It's a Trap"],["Talent","Parting Gift"],
                ["Missile","Proton Rocket"],["Bomb","Proton Bombs"]
            ]
        };

        if (presets[pilot]) {
            let total = 0;
            presets[pilot].forEach(([cat,val]) => {
                const s = document.createElement("select");
                s.className = "upgrade-select"; s.disabled = true;
                s.dataset.category = cat;
                s.innerHTML = `<option>${val}</option>`;
                total += bwingExtras[cat][val] || 0;
                upSec.appendChild(s);
            });
            pts.innerText = `Użyte punkty: ${total}/${data.upgradeLimit}`;
            return;
        }

        const missileSelects = [], bombSelects = [], modificationSelects = [], cannonSelects = [], titleSelects = [], gunnerSelects = [];

        [
            ["Talent",data.talentSlots],
            ["Sensor",data.sensorSlots],
            ["Cannon",data.cannonSlots],
            ["Torpedo",data.torpedoSlots],
            ["Missile",data.missileSlots],
            ["Bomb",data.bombSlots],
            ["Modification",data.modificationSlots],
            ["Title",data.titleSlots],
            ["Configuration",data.configurationSlots]
        ].forEach(([cat,count]) => {
            for (let i = 1; i <= count; i++) {
                const sel = createUpgradeSelect(upSec, cat, bwingExtras[cat], `No ${cat} (Slot ${i})`);
                if (cat === "Missile") missileSelects.push(sel);
                if (cat === "Bomb") bombSelects.push(sel);
                if (cat === "Modification") modificationSelects.push(sel);
                if (cat === "Cannon") cannonSelects.push(sel);
                if (cat === "Title") titleSelects.push(sel);
            }
        });

        function enforceSpecialConstraints() {
            const blockBombs = missileSelects.some(s => s.value === "Electro-Chaff Missiles");
            bombSelects.forEach(bs => {
                bs.disabled = blockBombs;
                if (blockBombs) bs.value = "";
            });

            const blockMods = bombSelects.some(s => s.value === "Electro-Proton Bomb");
            modificationSelects.forEach(ms => {
                ms.disabled = blockMods;
                if (blockMods) ms.value = "";
            });
        }

        // Obsługa blokady slotów cannon w obu kierunkach
        if (cannonSelects.length === 2) {
            // Gdy zmienia się pierwszy slot → blokada drugiego (jak było)
            cannonSelects[0].onchange = () => {
                const v = cannonSelects[0].value;
                const lock2 = v === "Proton Cannons" || v === "Synced Laser Cannons";
                cannonSelects[1].disabled = lock2;
                if (lock2) cannonSelects[1].value = "";
                updateUpgradePointsDisplay(div);
            };
            // Gdy zmienia się drugi slot → blokada pierwszego (nowość)
            cannonSelects[1].onchange = () => {
                const v2 = cannonSelects[1].value;
                const lock1 = v2 === "Proton Cannons" || v2 === "Synced Laser Cannons";
                cannonSelects[0].disabled = lock1;
                if (lock1) cannonSelects[0].value = "";
                updateUpgradePointsDisplay(div);
            };
        }

        missileSelects.forEach(s => {
            s.onchange = () => {
                enforceSpecialConstraints();
                updateUpgradePointsDisplay(div);
            };
        });
        bombSelects.forEach(s => {
            s.onchange = () => {
                enforceSpecialConstraints();
                updateUpgradePointsDisplay(div);
            };
        });
        modificationSelects.forEach(s => {
            s.onchange = () => updateUpgradePointsDisplay(div);
        });

        titleSelects.forEach(tsel => {
            tsel.onchange = () => {
                const hasB6 = tsel.value === "B6 Blade Wing Prototype";
                if (hasB6 && !gunnerSelects.length) {
                    const g = createUpgradeSelect(upSec, "Gunner Upgrade", bwingExtras["Gunner Upgrade"], "No Gunner (added)");
                    g.onchange = () => updateUpgradePointsDisplay(div);
                    gunnerSelects.push(g);
                }
                if (!hasB6 && gunnerSelects.length) {
                    gunnerSelects.forEach(x => x.remove());
                    gunnerSelects.length = 0;
                }
                updateUpgradePointsDisplay(div);
            };
        });

        enforceSpecialConstraints();
        updateUpgradePointsDisplay(div);
    }

    function createUpgradeSelect(container, category, options, defaultText) {
        const sel = document.createElement("select");
        sel.className = "upgrade-select";
        sel.dataset.category = category;
        sel.innerHTML = `<option value="">${defaultText}</option>`;
        Object.keys(options).forEach(opt => {
            sel.innerHTML += `<option value="${opt}">${opt} (${options[opt]} pkt)</option>`;
        });
        container.appendChild(sel);
        sel.onchange = () => updateUpgradePointsDisplay(container.parentElement);
        return sel;
    }

    function updateUpgradePointsDisplay(div) {
        const pilot = div.querySelector(".pilot-select").value;
        const out = div.querySelector(".upgrade-points");
        if (!pilot) return out.innerText = "Użyte punkty: 0 / -";
        const used = calculateUpgradePoints(div);
        const limit = ships["B-Wing"][pilot].upgradeLimit;
        out.innerText = `Użyte punkty: ${used} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(div) {
        return Array.from(div.querySelectorAll(".upgrade-select"))
            .reduce((sum, sel) => {
                const v = sel.value, cat = sel.dataset.category;
                return sum + (v ? bwingExtras[cat][v] : 0);
            }, 0);
    }

    window.bwingRules = {
        addShip,
        calculateUpgradePoints,
        getPilotPoints: div => {
            const p = div.querySelector(".pilot-select").value;
            return ships["B-Wing"][p]?.cost || 0;
        },
        getUpgradePoints: calculateUpgradePoints
    };
})();
