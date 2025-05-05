(function() {
  // Dane dla statków Y-wing
  const ships = {
    "Y-wing": {
      "Horton Salm": { cost: 4, upgradeLimit: 16, force: 0 },
      "Dutch Vander": { cost: 4, upgradeLimit: 10, force: 0 },
      "Dutch Vander Battle of Yavin": { cost: 4, upgradeLimit: 10, force: 0 },
      "Duch Bander Gold Leader": { cost: 4, upgradeLimit: 10, force: 0 },
      "Pops Krail Battle of Yavin": { cost: 3, upgradeLimit: 10, force: 0 },
      "Norra Wexley": { cost: 5, upgradeLimit: 25, force: 0 },
      "Pops Krail": { cost: 3, upgradeLimit: 4, force: 0 },
      "Evaana Verliane": { cost: 3, upgradeLimit: 5, force: 0, modificationSlots: 2 },
      "Gold Squadron Veteran": { cost: 3, upgradeLimit: 8, force: 0, modificationSlots: 1 },
      "Gray Squadron Bomber": { cost: 4, upgradeLimit: 18, force: 0, modificationSlots: 1 },
      "Hol Okand Battle of Yavin": { cost: 3, upgradeLimit: 10, force: 0 },
      "Horton Salm Battle of Yavin": { cost: 4, upgradeLimit: 10, force: 0 },
      "Dex Tiree Battle of Yavin": { cost: 4, upgradeLimit: 10, force: 0 }
    }
  };

  const yWingExtras = {
    "Bombs": { "Standard Bombs": 4, "Advanced Bombs": 6, "Proton Bombs": 5, "Proximity Mines": 5 },
    "Gunner": { "Standard Gunner": 3, "Veteran Gunner": 5 },
    "Turret": { "Standard Turret": 2, "Advanced Turret": 3, "Ion Cannon Turret": 5, "Dorsal Turret": 4 },
    "Talent Upgrade": { "Outmaneuver": 6, "Lone Wolf": 4 },
    "Torpedo Upgrade": { "Proton Torpedoes": 6, "Advanced Proton Torpedoes": 8 },
    "Missile Upgrade": { "Concussion Missiles": 5, "Cluster Missiles": 6 },
    "Astromech Upgrade": { "R2-D2": 5, "R5-D4": 3, "Targeting Astromech": 4, "R4 Astromech": 2, "Precise Astromech": 3 },
    "Modification Upgrade": { "Shield Upgrade": 6, "Stealth Device": 5 }
  };

  // Funkcja dodająca statek Y-wing
  function addShip(defaults = {}) {
    const squadronDiv = document.getElementById("squadron");
    const shipDiv = document.createElement("div");
    shipDiv.className = "ship-section ywing";

    const shipSelect = document.createElement("select");
    shipSelect.className = "ship-select";
    shipSelect.innerHTML = `<option value="Y-wing">Y-wing</option>`;
    shipSelect.onchange = () => updatePilotOptions(shipDiv, shipSelect.value, defaults);
    shipDiv.appendChild(shipSelect);

    const pilotSelect = document.createElement("select");
    pilotSelect.className = "pilot-select";
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    pilotSelect.onchange = () => updateUpgrades(shipDiv, defaults);
    shipDiv.appendChild(pilotSelect);

    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "upgrade-section";
    shipDiv.appendChild(upgradeDiv);

    const pointsDiv = document.createElement("div");
    pointsDiv.className = "upgrade-points";
    shipDiv.appendChild(pointsDiv);

    squadronDiv.appendChild(shipDiv);
    updatePilotOptions(shipDiv, "Y-wing", defaults);
  }

  function updatePilotOptions(shipDiv, selectedShip, defaults) {
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    Object.keys(ships[selectedShip]).forEach(pilot => {
      pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${ships[selectedShip][pilot].cost} pkt)</option>`;
    });
    if (defaults.pilot) pilotSelect.value = defaults.pilot;
    updateUpgrades(shipDiv, defaults);
  }

  function updateUpgrades(shipDiv, defaults) {
    const pilotName = shipDiv.querySelector(".pilot-select").value;
    if (!pilotName) return;

    const upSec = shipDiv.querySelector(".upgrade-section");
    const ptsDiv = shipDiv.querySelector(".upgrade-points");
    upSec.innerHTML = "";

    // Presety dla specjalnych pilotów
    const presetsByPilot = {
      "Dutch Vander Battle of Yavin": [
        ["Turret", "Ion Cannon Turret"],
        ["Torpedo Upgrade", "Advanced Proton Torpedoes"],
        ["Astromech Upgrade", "Targeting Astromech"]
      ],
      "Duch Bander Gold Leader": [
        ["Turret", "Ion Cannon Turret"],
        ["Bombs", "Proton Bombs"]
      ],
      "Pops Krail Battle of Yavin": [
        ["Turret", "Ion Cannon Turret"],
        ["Torpedo Upgrade", "Advanced Proton Torpedoes"],
        ["Astromech Upgrade", "R4 Astromech"]
      ],
      "Hol Okand Battle of Yavin": [
        ["Turret", "Dorsal Turret"],
        ["Torpedo Upgrade", "Advanced Proton Torpedoes"],
        ["Astromech Upgrade", "Precise Astromech"]
      ],
      "Horton Salm Battle of Yavin": [
        ["Turret", "Ion Cannon Turret"],
        ["Bombs", "Proximity Mines"]
      ],
      "Dex Tiree Battle of Yavin": [
        ["Turret", "Dorsal Turret"],
        ["Torpedo Upgrade", "Advanced Proton Torpedoes"],
        ["Astromech Upgrade", "R4 Astromech"]
      ]
    };

    if (presetsByPilot[pilotName]) {
      let total = 0;
      presetsByPilot[pilotName].forEach(([cat, val]) => {
        const sel = document.createElement("select");
        sel.className = "upgrade-select";
        sel.disabled = true;
        sel.setAttribute("data-category", cat);
        sel.innerHTML = `<option>${val}</option>`;
        total += yWingExtras[cat][val] || 0;
        upSec.appendChild(sel);
      });
      const limit = ships["Y-wing"][pilotName].upgradeLimit;
      ptsDiv.innerHTML = `Użyte punkty: ${total} / ${limit}`;
      if (typeof updateGlobalTotalPoints === 'function') updateGlobalTotalPoints();
      return;
    }

    const isDutch = pilotName === "Dutch Vander";
    const categories = Object.keys(yWingExtras);
    categories.forEach(category => {
      if (category === "Gunner" && pilotName !== "Norra Wexley") return;
      if (category === "Talent Upgrade" && (pilotName === "Horton Salm" || pilotName === "Evaana Verliane")) return;
      if (category === "Bombs" && isDutch) {
        for (let i = 0; i < 2; i++) createSelectSlot(upSec, category, i, defaults);
        return;
      }
      if (pilotName === "Gold Squadron Veteran" && !["Turret","Modification Upgrade","Torpedo Upgrade"].includes(category)) return;
      if (pilotName === "Gray Squadron Bomber" && !["Turret","Astromech Upgrade","Bombs","Modification Upgrade","Missile Upgrade"].includes(category)) return;

      createSelectSlot(upSec, category, null, defaults);
      if (pilotName === "Evaana Verliane" && category === "Modification Upgrade") {
        for (let i = 1; i < ships["Y-wing"][pilotName].modificationSlots; i++) {
          createSelectSlot(upSec, category, i, defaults);
        }
      }
    });

    updateUpgradePointsDisplay(shipDiv);
  }

  function createSelectSlot(container, category, index, defaults) {
    const select = document.createElement("select");
    select.className = "upgrade-select";
    select.dataset.category = category;
    const slotLabel = index != null ? ` (Slot ${index+1})` : '';
    select.innerHTML = `<option value=''>No ${category}${slotLabel}</option>`;
    Object.entries(yWingExtras[category]).forEach(([upg, cost]) => {
      select.innerHTML += `<option value='${upg}'>${upg} (${cost} pkt)</option>`;
    });
    select.onchange = () => updateUpgradePointsDisplay(container.closest('.ywing'));
    container.appendChild(select);
    const def = defaults.upgrades && defaults.upgrades[category];
    if (def) select.value = def;
  }

  function updateUpgradePointsDisplay(shipDiv) {
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    const pilotData = ships["Y-wing"][pilotSelect.value] || {};
    const upgradeLimit = pilotData.upgradeLimit || 0;
    const used = calculateUpgradePoints(shipDiv);
    const pointsDiv = shipDiv.querySelector(".upgrade-points");
    pointsDiv.innerHTML = `Użyte punkty: ${used} / ${upgradeLimit}`;
    if (typeof updateGlobalTotalPoints === 'function') updateGlobalTotalPoints();
  }

  function calculateUpgradePoints(shipDiv) {
    return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
      return sum + (yWingExtras[sel.dataset.category][sel.value] || 0);
    }, 0);
  }

  function getPilotPoints(shipDiv) {
    const pilot = shipDiv.querySelector(".pilot-select").value;
    return ships["Y-wing"][pilot]?.cost || 0;
  }

  // Eksport funkcji modułu ywingRules
  window.ywingRules = {
    addShip,
    calculateUpgradePoints,
    getPilotPoints
  };
})();
