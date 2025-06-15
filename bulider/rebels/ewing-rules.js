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
      "Talent Upgrade": 
        {
             "Composure": 1, "Deadeye Shot": 1, "Hopeful": 1, "Marg Sable Closure": 1,
              "Marksmanship": 2, "Debris Gambit": 3, "Lone Wolf": 3, "Predator": 3,"Daredevil" : 4, "Elusive": 4,
              "Enduring": 4, "Selfess": 4, "Squad Leader": 4, "Trick a shot": 4, "Crack Shot": 5, "Intimidation": 7,
              "Juke": 7, "Snap shot": 7, "Swarm Tactics": 7, "Outmaneuver": 9
        },
      "Sensor Upgrade": 
        {
              "Fire-Control System":2, "Passive Sensors":5, "Collision Detector":7, "Advanced Sensors":8, "Trajectory Simulator":10
        },
      "Torpedo Upgrade": 
        { 
          "Homing Torpedoes":4, "Ion Torpedoes":5, "Plasma Torpedoes":7, "Adv Proton Torpedoes":9, "Proton Torpedoes":14
        },
      "Tech Upgrade": 
        { 
        "Targeting Synchronizer": 3, "Advanced Optics": 4, "Pattern Analyzer": 5 , "Primed Thrusters" : 6
        },
      "Astromech Upgrade": 
        {
          "Chopper": 2, "R4 Astromech": 2, "Watchful Astromech": 2, "R3 Astromech": 3, "R5 Astromech": 7, "R2 Astromech" : 8, "R5-D8": 9, "R2 D2" : 10
        },
      "Modification Upgrade": 
       {
         "Angled Deflectors": 1, "Delayed Fuses": 1, "Munitions Failsafe": 1, "Targeting Computer": 1, "Electronic Baffle": 2, "Afterburners":8, 
         "Hull Upgrade": 9, "Shield Upgrade": 10, "Static Descharge Vanes" : 12
       }
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
  