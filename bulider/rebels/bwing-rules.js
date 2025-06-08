(function () {
    const ships = {
        "B-Wing": {
            "Hera Syndulle": {cost: 7, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 1, bombSlots: 1, modificationSlots: 1, titleSlots: 1, configurationSlots: 1, upgradeLimit: 12},
            "Gina Moonsong": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Gina Moonsong Battle Over Endor": {cost: 6, talentSlots: 2, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 13},
            "Braylen Stramma": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Braylen Stramma Battle Over Endor": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 0, missileSlots: 1, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Adon Fox Battle Over Endor": {cost: 6, talentSlots: 2, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 0, missileSlots: 1, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 12},
            "Ten Numb": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Netrem Pollard": {cost: 6, talentSlots: 1, sensorSlots: 1, cannonSlots: 2, torpedoSlots: 0, missileSlots: 1, bombSlots: 1, modificationSlots: 1, titleSlots: 0, configurationSlots: 1, upgradeLimit: 11},
            "Blade Squadron Veteran ": {cost: 5, talentSlots: 0, sensorSlots: 2, cannonSlots: 2, torpedoSlots: 1, missileSlots: 0, bombSlots: 0, modificationSlots: 0, titleSlots: 0, configurationSlots: 1, upgradeLimit: 10},
            "Blue Squadron Pilot": {cost: 5, talentSlots: 0, sensorSlots: 2, cannonSlots: 2, torpedoSlots: 0, missileSlots: 0, bombSlots: 1, modificationSlots: 0, titleSlots: 0, configurationSlots: 1, upgradeLimit: 10}
        }
    };

    const bwingExtras = {
        "Talent": {
            "Composure": 1, "Deadeye Shot": 1, "Hopeful": 1, "Marg Sable Closure": 1,
            "Marksmanship": 2, "Debris Gambit": 3, "Lone Wolf": 3, "Predator": 3, "Elusive": 4,
            "Enduring": 4, "Saturation Salvo": 4, "Selfess": 4, "Squad Leader": 4, "Trick a shot": 4, "Crack Shot": 5, "Intimidation": 7,
            "Juke": 7, "Snap shot": 7, "Swarm Tactics": 7, "Outmaneuver": 9
        },
        "Sensor": {
            "Fire-Control System": 2, "Passive Sensors": 5, "Collision Detector": 7, "Advanced Sensors": 8, "Trajectory Simulator": 10
        },
        "Cannon": {
            "Jamming Beam": 1, "Heavy Laser Cannon": 5, "Proton Cannons": 5, "Ion Cannon": 6,
            "Synced Laser Cannons": 6, "Tractor Beam": 6, "Autoblasters": 7
        },
        "Torpedo": {
            "Homing Torpedoes": 4, "Ion Torpedoes": 5, "Plasma Torpedoes": 7, "Adv Proton Torpedoes": 9, "Proton Torpedoes": 14
        },
        "Missile": {
            "Ion Missiles": 3, "XX-23 S-Thread Tracers": 4, "Homing Missiles": 5, "Cluster Missiles": 6, "Proton Rocket": 6, "Concussion Missiles": 7,
            "Mag-Pulse Warheads": 7, "Electro-Chaff Missles": 11
        },
        "Bomb": {
            "Seismic Charges": 3, "Ion Bombs": 4, "Blazer Bomb": 5, "Concussion Bombs": 5, "Conner Net": 4, "Proton Bombs": 5,
            "Thermal Detonators": 3, "Cluster Mines": 4, "Electro-Proton Bomb": 8, "Proximity Mines": 3
        },
        "Modification": {
            "Angled Deflectors": 1, "Delayed Fuses": 1, "Munitions Failsafe": 1, "Targeting Computer": 1, "Electronic Baffle": 2,
            "Afterburners": 8, "Hull Upgrade": 9, "Shield Upgrade": 10, "Static Descharge Vanes": 12
        },
        "Title": {
            "B6 Blade Wing Prototype": 2
        },
          "Gunner Upgrade": 
        { 
            "Sabine Wren": 2, "Skilled Bombardier": 2, "Agile Gunner": 4, "Hotshot Gunner": 5, 
            "Veteran Tail Gunner": 6, "Suppressive Gunner": 7,"Ezra Bridger" : 9, "Han Solo" : 10, "Bistan": 12,
            "Luke Skywalker" : 12
        },
        "Configuration": {
            "Stabilized S-Foils": 2
        }
    };

    function addShip() {
        const squadronDiv = document.getElementById("squadron");
        const shipDiv = document.createElement("div");
        shipDiv.className = "ship-section bwing";

        const shipSelect = document.createElement("select");
        shipSelect.className = "ship-select";
        shipSelect.innerHTML = `<option value="B-Wing">B-Wing</option>`;
        shipDiv.appendChild(shipSelect);

        const pilotSelect = document.createElement("select");
        pilotSelect.className = "pilot-select";
        pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
        pilotSelect.onchange = () => updateUpgrades(shipDiv);
        shipDiv.appendChild(pilotSelect);

        const upgradeDiv = document.createElement("div");
        upgradeDiv.className = "upgrade-section";
        shipDiv.appendChild(upgradeDiv);

        const pointsDiv = document.createElement("div");
        pointsDiv.className = "upgrade-points";
        shipDiv.appendChild(pointsDiv);

        squadronDiv.appendChild(shipDiv);
        updatePilotOptions(shipDiv, "B-Wing");
    }

    function updatePilotOptions(shipDiv, selectedShip) {
        const pilotSelect = shipDiv.querySelector(".pilot-select");
        pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
        if (ships[selectedShip]) {
            for (let pilot in ships[selectedShip]) {
                const cost = ships[selectedShip][pilot].cost;
                pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${cost} pkt)</option>`;
            }
        }
        updateUpgrades(shipDiv);
    }

    function updateUpgrades(shipDiv) {
        const pilotSel = shipDiv.querySelector(".pilot-select");
        const pilot = pilotSel.value;
        const upgradeSection = shipDiv.querySelector(".upgrade-section");
        const pointsDiv = shipDiv.querySelector(".upgrade-points");
        upgradeSection.innerHTML = "";
        pointsDiv.innerHTML = "";
        if (!pilot) return;

        const data = ships["B-Wing"][pilot];

        const presets = {
            "Gina Moonsong Battle Over Endor": [
                ["Talent", "It's a Trap"],
                ["Talent", "Juke"],
                ["Torpedo", "Proton Torpedoes"],
                ["Bomb", "Ion Bombs"]
            ],
            "Braylen Stramma Battle Over Endor": [
                ["Talent", "It's a Trap"],
                ["Missile", "Homing Missiles"],
                ["Bomb", "Proton Bombs"],
                ["Modification", "Delayed Fuses"]
            ],
            "Adon Fox Battle Over Endor": [
                ["Talent", "It's a Trap"],
                ["Talent", "Parting Gift"],
                ["Missile", "Proton Rocket"],
                ["Bomb", "Proton Bombs"]
            ]
        };

        if (presets[pilot]) {
            let total = 0;
            presets[pilot].forEach(([cat, val]) => {
                const sel = document.createElement("select");
                sel.className = "upgrade-select";
                sel.disabled = true;
                sel.dataset.category = cat;
                sel.innerHTML = `<option>${val}</option>`;
                total += bwingExtras[cat][val] || 0;
                upgradeSection.appendChild(sel);
            });
            pointsDiv.innerHTML = `Użyte punkty: ${total}/${data.upgradeLimit}`;
            return;
        }

        // Przygotowujemy tablice na selecty Missile, Bomb, Modification, Cannon, Title i ewentualnie Gunner
        const missileSelects = [];
        const bombSelects = [];
        const modificationSelects = [];
        const cannonSelects = [];
        const titleSelects = [];
        let gunnerSelects = []; // Miejsce na opcjonalny slot Gunner

        [
            ["Talent", data.talentSlots],
            ["Sensor", data.sensorSlots],
            ["Cannon", data.cannonSlots],
            ["Torpedo", data.torpedoSlots],
            ["Missile", data.missileSlots],
            ["Bomb", data.bombSlots],
            ["Modification", data.modificationSlots],
            ["Title", data.titleSlots],
            ["Configuration", data.configurationSlots]
        ].forEach(([cat, count]) => {
            for (let i = 1; i <= (count || 0); i++) {
                const select = createUpgradeSelect(upgradeSection, cat, bwingExtras[cat], `No ${cat} (Slot ${i})`);

                if (cat === "Cannon") {
                    cannonSelects.push(select);
                }
                if (cat === "Missile") {
                    missileSelects.push(select);
                }
                if (cat === "Bomb") {
                    bombSelects.push(select);
                }
                if (cat === "Modification") {
                    modificationSelects.push(select);
                }
                if (cat === "Title") {
                    titleSelects.push(select);
                }
            }
        });

        // Blokada drugiego Cannona, jeśli pierwszy to Proton Cannons lub Synced Laser Cannons
        if (cannonSelects.length === 2) {
            cannonSelects[0].onchange = () => {
                const val = cannonSelects[0].value;
                const lock = (val === "Proton Cannons" || val === "Synced Laser Cannons");
                cannonSelects[1].disabled = lock;
                if (lock) cannonSelects[1].value = "";
                updateUpgradePointsDisplay(shipDiv);
            };
            cannonSelects[1].onchange = () => updateUpgradePointsDisplay(shipDiv);
        }

        // Blokada slotów Bomb, jeśli wybrano "Electro-Chaff Missles" w dowolnym slocie Missile
        missileSelects.forEach(msel => {
            msel.onchange = () => {
                const anyElectro = missileSelects.some(s => s.value === "Electro-Chaff Missles");
                if (anyElectro) {
                    bombSelects.forEach(bs => {
                        bs.disabled = true;
                        if (bs.value) {
                            bs.value = "";
                        }
                    });
                } else {
                    bombSelects.forEach(bs => {
                        bs.disabled = false;
                    });
                }
                updateUpgradePointsDisplay(shipDiv);
            };
        });

        // Blokada slotów Modification, jeśli wybrano "Electro-Proton Bomb" w dowolnym slocie Bomb
        bombSelects.forEach(bs => {
            bs.onchange = () => {
                const anyEPB = bombSelects.some(s => s.value === "Electro-Proton Bomb");
                if (anyEPB) {
                    modificationSelects.forEach(ms => {
                        ms.disabled = true;
                        if (ms.value) {
                            ms.value = "";
                        }
                    });
                } else {
                    modificationSelects.forEach(ms => {
                        ms.disabled = false;
                    });
                }
                updateUpgradePointsDisplay(shipDiv);
            };
        });

        // NOWA LOGIKA: gdy w slocie Title wybierzesz "B6 Blade Wing Prototype", dodaj slot Gunner Upgrade
        titleSelects.forEach(tsel => {
            tsel.onchange = () => {
                const val = tsel.value;
                const hasB6 = (val === "B6 Blade Wing Prototype");

                if (hasB6) {
                    // jeśli jeszcze nie mamy slotu Gunner, to dodajemy
                    if (gunnerSelects.length === 0) {
                        // Tworzymy nowy select dla Gunner Upgrade
                        const gunnerSelect = createUpgradeSelect(upgradeSection, "Gunner Upgrade", bwingExtras["Gunner Upgrade"], "No Gunner(added by B6 Title)");
                        gunnerSelects.push(gunnerSelect);
                        // Z każdorazową zmianą slotu Gunner odświeżamy punkty
                        gunnerSelect.onchange = () => updateUpgradePointsDisplay(shipDiv);
                    }
                } else {
                    // jeśli B6 nie jest wybrane, usuwamy wszystkie stworzone sloty Gunner
                    gunnerSelects.forEach(cs => {
                        cs.remove();
                    });
                    gunnerSelects = [];
                }
                updateUpgradePointsDisplay(shipDiv);
            };
        });

        // Każda zmiana w slotach Bomb, Modification, Gunner odświeża punkty:
        modificationSelects.forEach(ms => {
            ms.onchange = () => updateUpgradePointsDisplay(shipDiv);
        });
        bombSelects.forEach(bs => {
            bs.onchange = () => updateUpgradePointsDisplay(shipDiv);
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
        container.appendChild(select);

        // Domyślnie każdy select przy zmianie po prostu odświeża liczbę punktów:
        select.onchange = () => {
            updateUpgradePointsDisplay(container.parentElement);
        };

        return select;
    }

    function updateUpgradePointsDisplay(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        if (!ships["B-Wing"][pilot]) {
            shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: 0 / -`;
            return;
        }
        const points = calculateUpgradePoints(shipDiv);
        const limit = ships["B-Wing"][pilot].upgradeLimit;
        shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
        if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }

    function calculateUpgradePoints(shipDiv) {
        return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
            const val = sel.value;
            const cat = sel.dataset.category;
            return sum + (val && bwingExtras[cat][val] || 0);
        }, 0);
    }

    function getPilotPoints(shipDiv) {
        const pilot = shipDiv.querySelector(".pilot-select").value;
        return ships["B-Wing"][pilot]?.cost || 0;
    }

    window.bwingRules = { addShip, calculateUpgradePoints, getPilotPoints, getUpgradePoints: calculateUpgradePoints };
})();
