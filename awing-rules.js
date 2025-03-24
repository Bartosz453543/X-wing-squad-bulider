(function() {
  // Dane dla statków A‑wing – instrukcje dla pilotów
  const ships = {
    "A-wing": {
      "Hera Syndulla": { cost: 3, upgradeLimit: 8, force: 0, talentSlots: 2 },
      "Ahsoka Tano": { cost: 4, upgradeLimit: 10, force: 2, forceSlots: 2, modificationSlots: 2, missileSlots: 1, configurationSlots: 1 },
      "Tycho Celchu": { cost: 3, upgradeLimit: 8, force: 0 },
      "Jake": { cost: 2, upgradeLimit: 6, force: 0 },
      "Farrel": { cost: 2, upgradeLimit: 6, force: 0 },
      "Shara Bey": { cost: 3, upgradeLimit: 8, force: 0 },
      "Wedge Antiles": { cost: 6, upgradeLimit: 20, force: 0, talentSlots: 2 },
      "Wedge Antilles": { cost: 6, upgradeLimit: 20, force: 0, talentSlots: 2 },
      "Arvel Crynd": { cost: 3, upgradeLimit: 8, force: 0 },
      "Green Squadron Pilot": { cost: 2, upgradeLimit: 6, force: 0 },
      "Keo Venzee": { cost: 3, upgradeLimit: 8, force: 0 },
    }
  };

  // Dostępne ulepszenia – instrukcje dla ulepszeń
  const aWingExtras = {
    "Talent Upgrade": { "Evasive Maneuvers": 5, "Quick Reflexes": 4 },
    "Missile Upgrade": { "Concussion Missiles": 5, "Cluster Missiles": 6 },
    "Sensors": { "Advanced Sensors": 6, "Targeting Computer": 4 },
    "Modification Upgrade": { "Shield Upgrade": 5, "Stealth Device": 4 },
    "Configuration": { "Chassis Mod": 3, "Refit": 2 }
  };

  // Ulepszenia Force Upgrade (tylko dla Ahsoki)
  const forceExtras = { "Sense": 5, "Supernatural Reflexes": 10, "Brilliant Evasion": 6 };

  // Funkcja dodająca statek A‑wing
  function addShip() {
    const squadronDiv = document.getElementById("squadron");
    const shipDiv = document.createElement("div");
    shipDiv.className = "ship-section awing";

    const shipSelect = document.createElement("select");
    shipSelect.className = "ship-select";
    shipSelect.innerHTML = `<option value="A-wing">A-wing</option>`;
    shipDiv.appendChild(shipSelect);

    const pilotSelect = document.createElement("select");
    pilotSelect.className = "pilot-select";
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    pilotSelect.onchange = function() {
      updateUpgrades(shipDiv);
    };
    shipDiv.appendChild(pilotSelect);

    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "upgrade-section";
    shipDiv.appendChild(upgradeDiv);

    const pointsDiv = document.createElement("div");
    pointsDiv.className = "upgrade-points";
    shipDiv.appendChild(pointsDiv);

    squadronDiv.appendChild(shipDiv);
    updatePilotOptions(shipDiv, "A-wing");
  }

  // Aktualizacja listy pilotów
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

  // Aktualizacja sekcji ulepszeń
  function updateUpgrades(shipDiv) {
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    const upgradeSection = shipDiv.querySelector(".upgrade-section");
    const pointsDiv = shipDiv.querySelector(".upgrade-points");
    upgradeSection.innerHTML = "";
    pointsDiv.innerHTML = "";
    if (!pilotSelect.value) return;

    // Konfiguracja dla Ahsoki Tano
    if (pilotSelect.value === "Ahsoka Tano") {
      for (let i = 1; i <= 2; i++) {
        createUpgradeSelect(upgradeSection, "Force Upgrade", forceExtras, `No Force Upgrade (Slot ${i})`);
      }
      for (let i = 1; i <= 2; i++) {
        createUpgradeSelect(upgradeSection, "Modification Upgrade", aWingExtras["Modification Upgrade"], `No Modification Upgrade (Slot ${i})`);
      }
      createUpgradeSelect(upgradeSection, "Missile Upgrade", aWingExtras["Missile Upgrade"], "No Missile Upgrade");
      createUpgradeSelect(upgradeSection, "Configuration", aWingExtras["Configuration"], "No Configuration");
    }
    // Konfiguracja dla Hery Syndulli (2 Talenty)
    else if (pilotSelect.value === "Hera Syndulla") {
      for (let i = 1; i <= 2; i++) {
        createUpgradeSelect(upgradeSection, "Talent Upgrade", aWingExtras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
      }
      for (let category in aWingExtras) {
        if (category !== "Talent Upgrade") {
          createUpgradeSelect(upgradeSection, category, aWingExtras[category], `No ${category}`);
        }
      }
    }
    // Standardowa konfiguracja dla pozostałych pilotów
    else {
      for (let category in aWingExtras) {
        createUpgradeSelect(upgradeSection, category, aWingExtras[category], `No ${category}`);
      }
    }

    updateUpgradePointsDisplay(shipDiv);
  }

  // Funkcja tworząca pojedynczy select dla danej kategorii ulepszenia
  function createUpgradeSelect(container, category, optionsObj, defaultText) {
    const select = document.createElement("select");
    select.className = "upgrade-select";
    select.dataset.category = category;
    select.innerHTML = `<option value=''>${defaultText}</option>`;
    for (let upgrade in optionsObj) {
      select.innerHTML += `<option value='${upgrade}'>${upgrade} (${optionsObj[upgrade]} pkt)</option>`;
    }
    select.onchange = function() {
      updateUpgradePointsDisplay(container.parentNode);
    };
    container.appendChild(select);
  }

  // Oblicza i wyświetla punkty ulepszeń
  function updateUpgradePointsDisplay(shipDiv) {
    const pointsDiv = shipDiv.querySelector(".upgrade-points");
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    const upgradePoints = calculateUpgradePoints(shipDiv);
    const upgradeLimit = ships["A-wing"][pilotSelect.value]?.upgradeLimit || 0;

    pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;

    if (typeof updateGlobalTotalPoints === 'function') {
      updateGlobalTotalPoints();
    }
  }

  function calculateUpgradePoints(shipDiv) {
    let total = 0;
    const selects = shipDiv.querySelectorAll(".upgrade-select");
    selects.forEach(select => {
      let extras = select.dataset.category === "Force Upgrade" ? forceExtras : aWingExtras[select.dataset.category];
      if (select.value && extras && extras[select.value]) {
        total += extras[select.value];
      }
    });
    return total;
  }

  function getPilotPoints(shipDiv) {
    let points = 0;
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    if (pilotSelect && pilotSelect.value) {
      const pilotData = ships["A-wing"][pilotSelect.value];
      points = pilotData.cost;
    }
    return points;
  }

  // Eksport modułu awingRules
  window.awingRules = {
    addShip: addShip,
    calculateUpgradePoints: calculateUpgradePoints,
    getPilotPoints: getPilotPoints,
    getUpgradePoints: calculateUpgradePoints
  };
})();
