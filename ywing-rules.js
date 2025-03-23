(function() {
  // Dane dla statków Y‑wing
  const ships = {
    "Y-wing": {
      "Horton Salm": { cost: 4, upgradeLimit: 16, force: 0 },
      "Dutch Vander": { cost: 4, upgradeLimit: 10, force: 0 },
      "Norra Wexley": { cost: 4, upgradeLimit: 16, force: 0 },
      "Pops Krail": { cost: 4, upgradeLimit: 16, force: 0 },
      "Evaana Verliane": { cost: 4, upgradeLimit: 16, force: 0, modificationSlots: 2 },
      "Gold Squadron Veteran": { cost: 4, upgradeLimit: 16, force: 0, modificationSlots: 1 },
      "Gray Squadron Bomber": { cost: 4, upgradeLimit: 12, force: 0, modificationSlots: 1 }
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
    "Modification Upgrade": { "Shield Upgrade": 6, "Stealth Device": 5 },
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
    updateGlobalTotalPoints();
  }

  function updateUpgrades(shipDiv) {
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    const upgradeSection = shipDiv.querySelector(".upgrade-section");
    const pointsDiv = shipDiv.querySelector(".upgrade-points");
    upgradeSection.innerHTML = "";
    pointsDiv.innerHTML = "";
    if (!pilotSelect.value) return;

    const pilotData = ships["Y-wing"][pilotSelect.value];
    let totalUpgradePointsForShip = 0;

    const isDutchVander = pilotSelect.value === "Dutch Vander";
    const isNorraWexley = pilotSelect.value === "Norra Wexley";
    const isHortonSalm = pilotSelect.value === "Horton Salm";

    // Iteracja po kategoriach upgrade’ów z obiektu yWingExtras
    for (let category in yWingExtras) {
      // Block Gunner upgrade for all pilots except Norra Wexley
      if (category === "Gunner" && !isNorraWexley) {
        continue;
      }

      // Block Talent Upgrade for Horton Salm
      if (category === "Talent Upgrade" && isHortonSalm) {
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
            updateGlobalTotalPoints();
          };
          upgradeSection.appendChild(select);
        }
        continue;
      }

      const select = document.createElement("select");
      select.className = "upgrade-select";
      select.dataset.category = category;
      select.innerHTML = `<option value=''>No ${category}</option>`;
      for (let upgrade in yWingExtras[category]) {
        select.innerHTML += `<option value='${upgrade}'>${upgrade} (${yWingExtras[category][upgrade]} pkt)</option>`;
      }
      select.onchange = function() {
        updateGlobalTotalPoints();
      };
      upgradeSection.appendChild(select);
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

  function getUpgradePoints(shipDiv) {
    return calculateUpgradePoints(shipDiv);
  }

  // Udostępniamy funkcje poprzez namespace ywingRules
  window.ywingRules = {
    addShip: addShip,
    getPilotPoints: getPilotPoints,
    getUpgradePoints: getUpgradePoints
  };
})();
