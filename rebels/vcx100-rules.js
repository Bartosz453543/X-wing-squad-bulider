(function () {
    const ships = {
      "VCX-100": {
        "Hera Syndulla": { cost: 82, talentSlots: 1, sensorSlots: 1, turretSlots: 1, torpedoSlots: 1, crewSlots: 2, modificationSlots: 1, titleSlots: 1, gunnerSlots: 1, upgradeLimit: 15 },
        "Kanan Jarrus": { cost: 80, forceSlots: 1, sensorSlots: 1, turretSlots: 1, torpedoSlots: 1, crewSlots: 2, modificationSlots: 1, titleSlots: 1, gunnerSlots: 1, upgradeLimit: 15 },
        "Chopper": { cost: 76, crewSlots: 2, turretSlots: 1, modificationSlots: 1, titleSlots: 1, gunnerSlots: 1, upgradeLimit: 13 },
        "Alexsandr Kallus": { cost: 80, talentSlots: 1, sensorSlots: 1, turretSlots: 1, torpedoSlots: 1, crewSlots: 2, modificationSlots: 1, titleSlots: 1, gunnerSlots: 1, upgradeLimit: 15 },
        "Lothal Rebel": { cost: 78, turretSlots: 1, torpedoSlots: 1, crewSlots: 1, upgradeLimit: 12 } 
      }
    };
  
    const vcx100Extras = {
      "Force Upgrade": { "Force Reflexes": 3, "Force Push": 4 },
      "Sensor Upgrade": { "Fire-Control System": 3, "Advanced Sensors": 4 },
      "Turret Upgrade": { "Dorsal Turret": 3, "Ion Cannon Turret": 5 },
      "Torpedo Upgrade": { "Proton Torpedoes": 6, "Ion Torpedoes": 5 },
      "Crew Upgrade": { "Zeb Orrelios": 4, "Kanan Jarrus": 5 },
      "Modification Upgrade": { "Hull Upgrade": 3, "Shield Upgrade": 5 },
      "Title Upgrade": { "Ghost": 0 },
      "Gunner Upgrade": { "Veteran Tail Gunner": 5, "Agile Gunner": 4 }
    };
  
    function addVCX100() {
      const squadronDiv = document.getElementById("squadron");
      const shipDiv = document.createElement("div");
      shipDiv.className = "ship-section vcx100";
  
      const shipSelect = document.createElement("select");
      shipSelect.className = "ship-select";
      shipSelect.innerHTML = `<option value="VCX-100">VCX-100</option>`;
      shipDiv.appendChild(shipSelect);
  
      const pilotSelect = document.createElement("select");
      pilotSelect.className = "pilot-select";
      pilotSelect.innerHTML = `<option value="">Select Pilot</option>`;
      for (let pilot in ships["VCX-100"]) {
        const cost = ships["VCX-100"][pilot].cost;
        pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${cost} pkt)</option>`;
      }
      pilotSelect.onchange = () => updateVCX100Upgrades(shipDiv);
      shipDiv.appendChild(pilotSelect);
  
      const upgradeDiv = document.createElement("div");
      upgradeDiv.className = "upgrade-section";
      shipDiv.appendChild(upgradeDiv);
  
      const pointsDiv = document.createElement("div");
      pointsDiv.className = "upgrade-points";
      shipDiv.appendChild(pointsDiv);
  
      squadronDiv.appendChild(shipDiv);
      updateVCX100Upgrades(shipDiv);
    }
  
    function updateVCX100Upgrades(shipDiv) {
      const pilot = shipDiv.querySelector(".pilot-select").value;
      const upgradeSection = shipDiv.querySelector(".upgrade-section");
      const pointsDiv = shipDiv.querySelector(".upgrade-points");
      upgradeSection.innerHTML = "";
      pointsDiv.innerHTML = "";
      if (!pilot) return;
  
      const data = ships["VCX-100"][pilot] || {};
      [
        ["Force Upgrade", data.forceSlots || 0],
        ["Sensor Upgrade", data.sensorSlots || 0],
        ["Turret Upgrade", data.turretSlots || 0],
        ["Torpedo Upgrade", data.torpedoSlots || 0],
        ["Crew Upgrade", data.crewSlots || 0],
        ["Modification Upgrade", data.modificationSlots || 0],
        ["Title Upgrade", data.titleSlots || 0],
        ["Gunner Upgrade", data.gunnerSlots || 0]
      ].forEach(([cat, count]) => {
        for (let i = 1; i <= count; i++) {
          createUpgradeSelect(upgradeSection, cat, vcx100Extras[cat], `Brak ${cat} (Slot ${i})`);
        }
      });
  
      updateVCX100PointsDisplay(shipDiv);
    }
  
    function createUpgradeSelect(container, category, options, defaultText) {
      const select = document.createElement("select");
      select.className = "upgrade-select";
      select.dataset.category = category;
      select.innerHTML = `<option value="">${defaultText}</option>`;
      for (let key in options) {
        select.innerHTML += `<option value="${key}">${key} (${options[key]} pkt)</option>`;
      }
      select.onchange = () => updateVCX100PointsDisplay(container.parentNode);
      container.appendChild(select);
    }
  
    function updateVCX100PointsDisplay(shipDiv) {
      const pilot = shipDiv.querySelector(".pilot-select").value;
      const points = calculateVCX100Points(shipDiv);
      const limit = ships["VCX-100"][pilot]?.upgradeLimit || 0;
      shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${points} / ${limit}`;
      if (window.updateGlobalTotalPoints) window.updateGlobalTotalPoints();
    }
  
    function calculateVCX100Points(shipDiv) {
      return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, sel) => {
        const val = sel.value;
        const cat = sel.dataset.category;
        return sum + (val && vcx100Extras[cat][val] || 0);
      }, 0);
    }
  
    function getVCX100PilotPoints(shipDiv) {
      const pilot = shipDiv.querySelector(".pilot-select").value;
      return ships["VCX-100"][pilot]?.cost || 0;
    }
  
    window.vcx100Rules = {
      addShip: addVCX100,
      calculateUpgradePoints: calculateVCX100Points,
      getPilotPoints: getVCX100PilotPoints,
      getUpgradePoints: calculateVCX100Points
    };
  })();
  