(function () {
    const ships = {
      "E-Wing": {
        "Corran Horn": { cost: 6, talentSlots: 1, sensorSlots: 2, torpedoSlots: 1, techSlots: 1, astromechSlots: 1, modificationSlots: 1, upgradeLimit: 9 },
        "Gavin Darklighter": { cost: 55, talentSlots: 1, sensorSlots: 1, techSlots: 1, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, upgradeLimit: 9 },
        "Rogue Squadron Escort": { cost: 50, talentSlots: 1, sensorSlots: 1, techSlots: 1, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, upgradeLimit: 9 },
        "Knave Squadron Escort": { cost: 47, talentSlots: 0, sensorSlots: 1, techSlots: 1, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, upgradeLimit: 8 }
  
  }
    };
  
    const ewingExtras = {
      "Talent Upgrade": { "Elusive": 2, "Predator": 2 },
      "Sensor Upgrade": { "Passive Sensors": 3, "Fire-Control System": 2 },
      "Torpedo Upgrade": { "Proton Torpedoes": 6, "Ion Torpedoes": 4 },
      "Tech Upgrade": { "Advanced Optics": 4, "Sensor Buoy Suite": 3 },
      "Astromech Upgrade": { "R2-D2": 5, "R5 Astromech": 3 },
      "Modification Upgrade": { "Hull Upgrade": 3, "Shield Upgrade": 4 }
    };
  
    function addShip() {
      const squadronDiv = document.getElementById("squadron");
      const shipDiv = document.createElement("div");
      shipDiv.className = "ship-section ewing";
  
      const shipSelect = document.createElement("select");
      shipSelect.className = "ship-select";
      shipSelect.innerHTML = `<option value="E-Wing">E-Wing</option>`;
      shipDiv.appendChild(shipSelect);
  
      const pilotSelect = document.createElement("select");
      pilotSelect.className = "pilot-select";
      pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
      pilotSelect.onchange = function () { updateUpgrades(shipDiv); };
      shipDiv.appendChild(pilotSelect);
  
      const upgradeDiv = document.createElement("div");
      upgradeDiv.className = "upgrade-section";
      shipDiv.appendChild(upgradeDiv);
  
      const pointsDiv = document.createElement("div");
      pointsDiv.className = "upgrade-points";
      shipDiv.appendChild(pointsDiv);
  
      squadronDiv.appendChild(shipDiv);
      updatePilotOptions(shipDiv, "E-Wing");
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
  
      const pilotData = ships["E-Wing"][pilotSelect.value];
  
      addUpgradeSlots(upgradeSection, "Talent Upgrade", ewingExtras["Talent Upgrade"], pilotData.talentSlots);
      addUpgradeSlots(upgradeSection, "Sensor Upgrade", ewingExtras["Sensor Upgrade"], pilotData.sensorSlots);
      addUpgradeSlots(upgradeSection, "Torpedo Upgrade", ewingExtras["Torpedo Upgrade"], pilotData.torpedoSlots);
      addUpgradeSlots(upgradeSection, "Tech Upgrade", ewingExtras["Tech Upgrade"], pilotData.techSlots);
      addUpgradeSlots(upgradeSection, "Astromech Upgrade", ewingExtras["Astromech Upgrade"], pilotData.astromechSlots);
      addUpgradeSlots(upgradeSection, "Modification Upgrade", ewingExtras["Modification Upgrade"], pilotData.modificationSlots);
  
      updateUpgradePointsDisplay(shipDiv);
    }
  
    function addUpgradeSlots(container, category, optionsObj, count = 0) {
      for (let i = 1; i <= count; i++) {
        const select = document.createElement("select");
        select.className = "upgrade-select";
        select.dataset.category = category;
        select.innerHTML = `<option value=''>No ${category} (Slot ${i})</option>`;
        for (let upgrade in optionsObj) {
          select.innerHTML += `<option value='${upgrade}'>${upgrade} (${optionsObj[upgrade]} pkt)</option>`;
        }
        select.onchange = function () { updateUpgradePointsDisplay(container.parentNode); };
        container.appendChild(select);
      }
    }
  
    function updateUpgradePointsDisplay(shipDiv) {
      const pointsDiv = shipDiv.querySelector(".upgrade-points");
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      const upgradePoints = calculateUpgradePoints(shipDiv);
      const upgradeLimit = ships["E-Wing"][pilotSelect.value]?.upgradeLimit || 0;
      pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
      if (typeof updateGlobalTotalPoints === 'function') { updateGlobalTotalPoints(); }
    }
  
    function calculateUpgradePoints(shipDiv) {
      let total = 0;
      const selects = shipDiv.querySelectorAll(".upgrade-select");
      selects.forEach(select => {
        const extras = ewingExtras[select.dataset.category];
        if (select.value && extras && extras[select.value]) {
          total += extras[select.value];
        }
      });
      return total;
    }
  
    function getPilotPoints(shipDiv) {
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      if (pilotSelect && pilotSelect.value) {
        return ships["E-Wing"][pilotSelect.value].cost;
      }
      return 0;
    }
  
    window.ewingRules = {
      addShip: addShip,
      calculateUpgradePoints: calculateUpgradePoints,
      getPilotPoints: getPilotPoints,
      getUpgradePoints: calculateUpgradePoints
    };
  })();
  