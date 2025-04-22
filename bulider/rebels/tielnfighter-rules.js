(function () {
  const ships = {
    "TIE/ln Fighter": {
      "Sabine Wren": { cost: 38, talentSlots: 1, modificationSlots: 1, upgradeLimit: 10 },
      "Ezra Bridger": { cost: 40, forceSlots: 1, crewSlots: 1, modificationSlots: 1, upgradeLimit: 10 },
      "Zeb Orrelios": { cost: 42, crewSlots: 1, modificationSlots: 1, upgradeLimit: 10 },
      "Captain Rex": { cost: 44, talentSlots: 2, modificationSlots: 1, upgradeLimit: 11 }
    }
  };

  const tielnExtras = {
    "Talent Upgrade": { "Crack Shot": 2, "Swarm Tactics": 3, "Expertise": 4, "Trick Shot": 3 },
    "Force Upgrade": { "Force Reflexes": 3, "Force Push": 4 },
    "Crew Upgrade": { "Zeb Orrelios": 4, "Kanan Jarrus": 5 },
    "Modification Upgrade": { "Hull Upgrade": 3, "Stealth Device": 4, "Advanced Sensors": 5 }
  };

  function addTIELn() {
    const squadronDiv = document.getElementById("squadron");
    const shipDiv = document.createElement("div");
    shipDiv.className = "ship-section tieln";

    const shipSelect = document.createElement("select");
    shipSelect.className = "ship-select";
    shipSelect.innerHTML = `<option value="TIE/ln Fighter">TIE/ln Fighter</option>`;
    shipDiv.appendChild(shipSelect);

    const pilotSelect = document.createElement("select");
    pilotSelect.className = "pilot-select";
    pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
    for (let pilot in ships["TIE/ln Fighter"]) {
      const cost = ships["TIE/ln Fighter"][pilot].cost;
      pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${cost} pkt)</option>`;
    }
    pilotSelect.onchange = () => updateTIELnUpgrades(shipDiv);
    shipDiv.appendChild(pilotSelect);

    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "upgrade-section";
    shipDiv.appendChild(upgradeDiv);

    const pointsDiv = document.createElement("div");
    pointsDiv.className = "upgrade-points";
    shipDiv.appendChild(pointsDiv);

    squadronDiv.appendChild(shipDiv);
    updateTIELnUpgrades(shipDiv);
  }

  function updateTIELnUpgrades(shipDiv) {
    const pilot = shipDiv.querySelector(".pilot-select").value;
    const upgradeSection = shipDiv.querySelector(".upgrade-section");
    const pointsDiv = shipDiv.querySelector(".upgrade-points");
    upgradeSection.innerHTML = "";
    pointsDiv.innerHTML = "";
    if (!pilot) return;

    const data = ships["TIE/ln Fighter"][pilot] || {};
    [
      ["Talent Upgrade", data.talentSlots || 0],
      ["Force Upgrade", data.forceSlots || 0],
      ["Crew Upgrade", data.crewSlots || 0],
      ["Modification Upgrade", data.modificationSlots || 0]
    ].forEach(([cat, count]) => {
      for (let i = 1; i <= count; i++) {
        createUpgradeSelect(upgradeSection, cat, tielnExtras[cat], `No ${cat} (Slot ${i})`);
      }
    });

    updateTIELnPointsDisplay(shipDiv);
  }

  function createUpgradeSelect(container, category, options, defaultText) {
    const select = document.createElement("select");
    select.className = "upgrade-select";
    select.dataset.category = category;
    select.innerHTML = `<option value="">${defaultText}</option>`;
    for (let key in options) {
      select.innerHTML += `<option value="${key}">${key} (${options[key]} pkt)</option>`;
    }
    select.onchange = () => updateTIELnPointsDisplay(container.parentNode);
    container.appendChild(select);
  }

  function updateTIELnPointsDisplay(shipDiv) {
    const pilot = shipDiv.querySelector(".pilot-select").value;
    const points = calculateTIELnPoints(shipDiv);
    const limit = ships["TIE/ln Fighter"][pilot]?.upgradeLimit || 0;
    shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
    if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
  }

  function calculateTIELnPoints(shipDiv) {
    return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
      const val = sel.value;
      const cat = sel.dataset.category;
      return sum + (val && tielnExtras[cat][val] || 0);
    }, 0);
  }

  function getTIELnPilotPoints(shipDiv) {
    const pilot = shipDiv.querySelector(".pilot-select").value;
    return ships["TIE/ln Fighter"][pilot]?.cost || 0;
  }

  window.tielnRules = {
    addShip: addTIELn,
    calculateUpgradePoints: calculateTIELnPoints,
    getPilotPoints: getTIELnPilotPoints,
    getUpgradePoints: calculateTIELnPoints
  };
})();
