(function() {
  // Dane dla statków Y‑wing
  const ships = {
    "Y-wing": {
      "Horton Salm": { cost: 4, upgradeLimit: 16, force: 0 },
      "Dutch Vander": { cost: 4, upgradeLimit: 10, force: 0 },
      "Norra Wexley": { cost: 5, upgradeLimit: 25, force: 0 },
      "Pops Krail": { cost: 3, upgradeLimit: 4, force: 0 },
      "Evaana Verliane": { cost: 3, upgradeLimit: 5, force: 0, modificationSlots: 2 },  // 2 modyfikacje
      "Gold Squadron Veteran": { cost: 3, upgradeLimit: 8, force: 0, modificationSlots: 1 },
      "Gray Squadron Bomber": { cost: 4, upgradeLimit: 18, force: 0, modificationSlots: 1 }
    }
  };

  const yWingExtras = {
    "Bombs": { "Standard Bombs": 4, "Advanced Bombs": 6 },
    "Gunner": { "Standard Gunner": 3, "Veteran Gunner": 5 },
    "Turret": { "Standard Turret": 2, "Advanced Turret": 3 },
    "Talent Upgrade": { "Outmaneuver": 6, "Lone Wolf": 4 },
    "Torpedo Upgrade": { "Proton Torpedoes": 6, "Advanced Proton Torpedoes": 8 },
    "Missile Upgrade": { "Concussion Missiles": 5, "Cluster Missiles": 6 },
    "Astromech Upgrade": { "R2-D2": 5, "R5-D4": 3 },
    "Modification Upgrade": { "Shield Upgrade": 6, "Stealth Device": 5 }
  };

  // Funkcja dodająca statek Y‑wing
  function addShip() {
    const squadronDiv = document.getElementById("squadron");
    const shipDiv = document.createElement("div");
    shipDiv.className = "ship-section ywing";
    
    const shipSelect = document.createElement("select");
    shipSelect.className = "ship-select";
    shipSelect.innerHTML = `<option value="Y-wing">Y-wing</option>`;
    shipSelect.onchange = function() { updatePilotOptions(shipDiv, shipSelect.value); };
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
    updatePilotOptions(shipDiv, "Y-wing");
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

    const isDutchVander = pilotSelect.value === "Dutch Vander";
    const isNorraWexley = pilotSelect.value === "Norra Wexley";
    const isHortonSalm = pilotSelect.value === "Horton Salm";
    const isEvaanaVerliane = pilotSelect.value === "Evaana Verliane";
    const isGoldSquadronVeteran = pilotSelect.value === "Gold Squadron Veteran";
    const isGraySquadronBomber = pilotSelect.value === "Gray Squadron Bomber";

    // Iteracja po kategoriach upgrade’ów z obiektu yWingExtras
    for (let category in yWingExtras) {
      // Block Gunner upgrade for all pilots except Norra Wexley
      if (category === "Gunner" && !isNorraWexley) {
        continue;
      }
      // Block Talent Upgrade for Horton Salm and Evaana Verliane
      if (category === "Talent Upgrade" && (isHortonSalm || isEvaanaVerliane)) {
        continue;
      }
      // Add two Bomb slots for Dutch Vander
      if (category === "Bombs" && isDutchVander) {
        for (let i = 0; i < 2; i++) {
          const select = document.createElement("select");
          select.className = "upgrade-select";
          select.dataset.category = category;
          select.innerHTML = `<option value=''>No ${category} (Slot ${i + 1})</option>`;
          for (let upgrade in yWingExtras[category]) {
            select.innerHTML += `<option value='${upgrade}'>${upgrade} (${yWingExtras[category][upgrade]} pkt)</option>`;
          }
          select.onchange = function() {
            updateUpgradePointsDisplay(shipDiv);
          };
          upgradeSection.appendChild(select);
        }
        continue;
      }
      // Dla Gold Squadron Veteran, tylko Turret, Modification Upgrade i Torpedo Upgrade
      if (isGoldSquadronVeteran) {
        if (category !== "Turret" && category !== "Modification Upgrade" && category !== "Torpedo Upgrade") {
          continue;
        }
      }
      // Dla Gray Squadron Bomber, tylko Turret, Astromech Upgrade, Bombs, Modification Upgrade i Missile Upgrade
      if (isGraySquadronBomber) {
        if (category !== "Turret" && category !== "Astromech Upgrade" && category !== "Bombs" && category !== "Modification Upgrade" && category !== "Missile Upgrade") {
          continue;
        }
      }

      const select = document.createElement("select");
      select.className = "upgrade-select";
      select.dataset.category = category;
      select.innerHTML = `<option value=''>No ${category}</option>`;
      for (let upgrade in yWingExtras[category]) {
        select.innerHTML += `<option value='${upgrade}'>${upgrade} (${yWingExtras[category][upgrade]} pkt)</option>`;
      }
      select.onchange = function() {
        updateUpgradePointsDisplay(shipDiv);
      };
      upgradeSection.appendChild(select);
    }

    // Dodaj modyfikacje dla Evaany Verliane
    if (isEvaanaVerliane) {
      for (let i = 0; i < 2; i++) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = "Modification Upgrade";
        select.innerHTML = `<option value=''>No Modification (Slot ${i + 1})</option>`;
        for (let upgrade in yWingExtras["Modification Upgrade"]) {
          select.innerHTML += `<option value='${upgrade}'>${upgrade} (${yWingExtras["Modification Upgrade"][upgrade]} pkt)</option>`;
        }
        select.onchange = function() {
          updateUpgradePointsDisplay(shipDiv);
        };
        upgradeSection.appendChild(select);
      }
    }

    updateUpgradePointsDisplay(shipDiv);
  }

  // Funkcja wyświetlająca "Użyte punkty" i "Maksymalne punkty"
  function updateUpgradePointsDisplay(shipDiv) {
    const pointsDiv = shipDiv.querySelector(".upgrade-points");
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    const upgradePoints = calculateUpgradePoints(shipDiv);
    const upgradeLimit = ships["Y-wing"][pilotSelect.value]?.upgradeLimit || 0;
    
    pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
    
    // Aktualizuj globalne sumowanie punktów
    if (typeof updateGlobalTotalPoints === 'function') {
      updateGlobalTotalPoints();
    }
  }

  function calculateUpgradePoints(shipDiv) {
    let total = 0;
    const selects = shipDiv.querySelectorAll(".upgrade-select");
    selects.forEach(select => {
      if (select.value) {
        if (yWingExtras[select.dataset.category] && yWingExtras[select.dataset.category][select.value]) {
          total += yWingExtras[select.dataset.category][select.value];
        }
      }
    });
    return total;
  }

  function getPilotPoints(shipDiv) {
    let points = 0;
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    if (pilotSelect && pilotSelect.value) {
      const pilotData = ships["Y-wing"][pilotSelect.value];
      points = pilotData.cost;
    }
    return points;
  }

  // Eksport funkcji modułu ywingRules
  window.ywingRules = {
    addShip: addShip,
    calculateUpgradePoints: calculateUpgradePoints,
    getPilotPoints: getPilotPoints,
    getUpgradePoints: calculateUpgradePoints
  };
})();