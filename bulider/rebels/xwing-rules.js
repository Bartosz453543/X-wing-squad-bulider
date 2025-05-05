(function () {
    // Dane dla statków X-Wing – instrukcje dla pilotów
    const ships = {
      "X-Wing": {
        "Luke Skywalker": { cost: 5, upgradeLimit: 5, force: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Wedge Antilles Battle Over Endor": { cost: 5, upgradeLimit: 11, force: 0, talentSlots: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Wedge Antilles": { cost: 5, upgradeLimit: 11, talentSlots: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Luke Skywalker Battle of Yavin": { cost: 5, upgradeLimit: 5, talentSlots: 1, force: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Luke Skywalker Red Five": { cost: 5, upgradeLimit: 5, talentSlots: 1, force: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Wedge Antilles Battle of Yavin": { cost: 5, upgradeLimit: 11, force: 0, talentSlots: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Yendor Battle of Endor": { cost: 4, upgradeLimit: 9, talentSlots: 1, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Wes Janson": { cost: 5, upgradeLimit: 17, talentSlots: 1, missileSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Corran Horn": { cost: 4, upgradeLimit: 9, talentSlots: 1, missileSlots: 1, astromechSlots: 1, configurationSlots: 1 },
        "Thane Kyrell": { cost: 4, upgradeLimit: 6, talentSlots: 1, missileSlots: 1, astromechSlots: 1, configurationSlots: 1 },
        "Garven Dreis Battle of Yavin": { cost: 5, upgradeLimit: 8, torpedoSlots: 1, astromechSlots: 1 },
        "Garven Dreis": { cost: 5, upgradeLimit: 17, talentSlots: 1, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Jek Porkins Battle of Yavin": { cost: 5, upgradeLimit: 8, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1 },
        "Jek Porkins": { cost: 4, upgradeLimit: 7, talentSlots: 1, torpedoSlots: 1, astromechSlots: 1, configurationSlots: 1 },
        "Jek Porkins Red Six": { cost: 5, upgradeLimit: 8, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1 },
        "Endy Idele Battle of Endor": { cost: 5, upgradeLimit: 8, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1 },
        "Kullbee Sperado": { cost: 4, upgradeLimit: 9, talentSlots: 1, missileSlots: 1, astromechSlots: 1, illegalUpgrades: 1, configurationSlots: 1 },
        "Biggs Darklighter": { cost: 5, upgradeLimit: 8, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1 },
        "Biggs Darklighter Battle of Yavin": { cost: 6, upgradeLimit: 5, force: 0, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Leevan Tenza": { cost: 4, upgradeLimit: 9, talentSlots: 1, missileSlots: 1, astromechSlots: 1, illegalUpgrades: 1, configurationSlots: 1 },
        "Red Squadron Veteran": { cost: 4, upgradeLimit: 8, talentSlots: 1, astromechSlots: 1, configurationSlots: 1 },
        "Blue Squadron Escort": { cost: 5, upgradeLimit: 18, astromechSlots: 1, torpedoSlots: 1, configurationSlots: 1, modificationSlots: 1 },
        "Edrio Two Tubes": { cost: 5, upgradeLimit: 18, missileSlots: 1, illegalUpgrades: 1, configurationSlots: 1 },
        "Cabern Angels Zealot": { cost: 5, upgradeLimit: 15, astromechSlots: 1, illegalUpgrades: 1, configurationSlots: 1, modificationSlots: 1 }
      }
    };
  
    const upgrades = {
      "Force Upgrade":         { "Sense": 5, "Supernatural Reflexes": 10, "Brilliant Evasion": 6 },
      "Talent Upgrade":        { "Outmaneuver": 6, "Lone Wolf": 4, "It's a Trap": 3, "Attack Speed": 7, "Predator": 5, "Marksmanship": 6, "Selfless": 3 },
      "Torpedo Upgrade":       { "Proton Torpedoes": 6, "Advanced Proton Torpedoes": 8, "Plasma Torpedoes": 7, "Ion Missiles": 5 },
      "Astromech Upgrade":     { "R2-D2": 5, "R5-D4": 3, "R2 D3": 4, "R2-A3": 4, "R5-K6": 3, "R5-D8": 4, "R2-F2": 5, "Modified R4-P Unit": 6, "Stabilizing Astromech": 4 },
      "Modification Upgrade":  { "Shield Upgrade": 6, "Stealth Device": 5, "Unstable Sublight Engines": 4, "Chaff Particles": 2 },
      "Configuration Upgrade": { "S-Foils": 0 },
      "Illegal Upgrade":       { "Illegal Upgrade 1": 10, "Illegal Upgrade 2": 12 },
      "Missile Upgrade":       { "Concussion Missiles": 5, "Cluster Missiles": 4 }
    };
  
    function addShip() {
      const squadronDiv = document.getElementById("squadron");
      const shipDiv = document.createElement("div");
      shipDiv.className = "ship-section xwing";
  
      const shipSelect = document.createElement("select");
      shipSelect.className = "ship-select";
      shipSelect.innerHTML = `<option value="X-Wing">X-Wing</option>`;
      shipDiv.appendChild(shipSelect);
  
      const pilotSelect = document.createElement("select");
      pilotSelect.className = "pilot-select";
      pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
      pilotSelect.onchange = function () {
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
      updatePilotOptions(shipDiv, "X-Wing");

      // Wybierz od razu pierwszego pilota i przelicz punkty
      if (pilotSelect.options.length > 1) {
        pilotSelect.selectedIndex = 1;
        updateUpgrades(shipDiv);
        if (typeof updateGlobalTotalPoints === 'function') {
          updateGlobalTotalPoints();
        }
      }
    }
  
    function updatePilotOptions(shipDiv, selectedShip) {
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
      if (ships[selectedShip]) {
        for (let pilot in ships[selectedShip]) {
          const pilotData = ships[selectedShip][pilot];
          pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${pilotData.cost} pkt)</option>`;
        }
      }
      updateUpgrades(shipDiv);
    }
  
    function updateUpgrades(shipDiv) {
      const pilotSel = shipDiv.querySelector(".pilot-select");
      const upSec     = shipDiv.querySelector(".upgrade-section");
      const ptsDiv    = shipDiv.querySelector(".upgrade-points");
      upSec.innerHTML  = "";
      ptsDiv.innerHTML = "";
      if (!pilotSel.value) return;
  
      const data = ships["X-Wing"][pilotSel.value];
  
      // Presety dla wybranych pilotów
      const applyPresets = (presets) => {
        let total = 0;
        presets.forEach(([cat, val]) => {
          const sel = document.createElement("select");
          sel.className = "upgrade-select";
          sel.disabled  = true;
          sel.setAttribute("data-category", cat);
          sel.innerHTML = `<option>${val}</option>`;
          total += upgrades[cat][val] || 0;
          upSec.appendChild(sel);
        });
        ptsDiv.innerHTML = `Użyte punkty: ${total}/${data.upgradeLimit}`;
        if (typeof updateGlobalTotalPoints === 'function') {
          updateGlobalTotalPoints();
        }
      };

      switch(pilotSel.value) {
        case "Wedge Antilles Battle Over Endor":
          applyPresets([
            ["Talent Upgrade","It's a Trap"],
            ["Torpedo Upgrade","Advanced Proton Torpedoes"],
            ["Astromech Upgrade","R2 D3"],
            ["Talent Upgrade","Predator"]
          ]);
          return;
        case "Luke Skywalker Battle of Yavin":
          applyPresets([
            ["Talent Upgrade","Attack Speed"],
            ["Force Upgrade","Instinctive Aim"],
            ["Torpedo Upgrade","Proton Torpedoes"],
            ["Astromech Upgrade","R2-D2"]
          ]);
          return;
        case "Luke Skywalker Red Five":
          applyPresets([
            ["Talent Upgrade","Instinctive Aim"],
            ["Torpedo Upgrade","Proton Torpedoes"],
            ["Astromech Upgrade","R2-D2"]
          ]);
          return;
        case "Wedge Antilles Battle of Yavin":
          applyPresets([
            ["Talent Upgrade","Attack Speed"],
            ["Talent Upgrade","Marksmanship"],
            ["Torpedo Upgrade","Proton Torpedoes"],
            ["Astromech Upgrade","R2-A3"]
          ]);
          return;
        case "Yendor Battle of Endor":
          applyPresets([
            ["Talent Upgrade","It's a Trap"],
            ["Torpedo Upgrade","Plasma Torpedoes"],
            ["Astromech Upgrade","Stabilizing Astromech"]
          ]);
          return;
        case "Garven Dreis Battle of Yavin":
          applyPresets([
            ["Torpedo Upgrade","Advanced Proton Torpedoes"],
            ["Astromech Upgrade","R5-K6"]
          ]);
          return;
        case "Jek Porkins Battle of Yavin":
          applyPresets([
            ["Torpedo Upgrade","Advanced Proton Torpedoes"],
            ["Astromech Upgrade","R5-D8"],
            ["Modification Upgrade","Unstable Sublight Engines"]
          ]);
          return;
        case "Jek Porkins Red Six":
          applyPresets([
            ["Talent Upgrade","Predator"],
            ["Torpedo Upgrade","Proton Torpedoes"],
            ["Astromech Upgrade","R5-D8"]
          ]);
          return;
        case "Endy Idele Battle of Endor":
          applyPresets([
            ["Talent Upgrade","It's a Trap"],
            ["Torpedo Upgrade","Ion Missiles"],
            ["Astromech Upgrade","Modified R4-P Unit"],
            ["Modification Upgrade","Chaff Particles"]
          ]);
          return;
        case "Biggs Darklighter Battle of Yavin":
          applyPresets([
            ["Talent Upgrade","Attack Speed"],
            ["Talent Upgrade","Selfless"],
            ["Torpedo Upgrade","Proton Torpedoes"],
            ["Astromech Upgrade","R2-F2"]
          ]);
          return;
      }

      // Domyślne sloty dla reszty pilotów
      if (data.talentSlots) for (let i=1;i<=data.talentSlots;i++) createUpgradeSelect(upSec,"Talent Upgrade",upgrades["Talent Upgrade"],`No Talent Upgrade (Slot ${i})`);
      if (data.astromechSlots) for (let i=1;i<=data.astromechSlots;i++) createUpgradeSelect(upSec,"Astromech Upgrade",upgrades["Astromech Upgrade"],`No Astromech Upgrade (Slot ${i})`);
      if (data.torpedoSlots) for (let i=1;i<=data.torpedoSlots;i++) createUpgradeSelect(upSec,"Torpedo Upgrade",upgrades["Torpedo Upgrade"],`No Torpedo Upgrade (Slot ${i})`);
      if (data.modificationSlots) for (let i=1;i<=data.modificationSlots;i++) createUpgradeSelect(upSec,"Modification Upgrade",upgrades["Modification Upgrade"],`No Modification (Slot ${i})`);
      if (data.missileSlots) for (let i=1;i<=data.missileSlots;i++) createUpgradeSelect(upSec,"Missile Upgrade",upgrades["Missile Upgrade"],`No Missile Upgrade (Slot ${i})`);
      if (data.force) for (let i=1;i<=data.force;i++) createUpgradeSelect(upSec,"Force Upgrade",upgrades["Force Upgrade"],`No Force Upgrade (Slot ${i})`);
      if (data.configurationSlots) for (let i=1;i<=data.configurationSlots;i++) createUpgradeSelect(upSec,"Configuration Upgrade",upgrades["Configuration Upgrade"],`No Configuration (Slot ${i})`);
      if (data.illegalUpgrades) for (let i=1;i<=data.illegalUpgrades;i++) createUpgradeSelect(upSec,"Illegal Upgrade",upgrades["Illegal Upgrade"],`No Illegal Upgrade (Slot ${i})`);
  
      updateUpgradePointsDisplay(shipDiv);
    }
  
    function createUpgradeSelect(container, category, optionsObj, defaultText) {
      const select = document.createElement("select");
      select.className = "upgrade-select";
      select.dataset.category = category;
      select.innerHTML = `<option value=''>${defaultText}</option>`;
      for (let upgrade in optionsObj) {
        select.innerHTML += `<option value='${upgrade}'>${upgrade} (${optionsObj[upgrade]} pkt)</option>`;
      }
      select.onchange = function () {
        updateUpgradePointsDisplay(container.parentNode);
      };
      container.appendChild(select);
    }
  
    function updateUpgradePointsDisplay(shipDiv) {
      const pointsDiv = shipDiv.querySelector(".upgrade-points");
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      const upgradePoints = calculateUpgradePoints(shipDiv);
      const upgradeLimit = ships["X-Wing"][pilotSelect.value]?.upgradeLimit || 0;
      pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
      if (typeof updateGlobalTotalPoints === 'function') {
        updateGlobalTotalPoints();
      }
    }
  
    function calculateUpgradePoints(shipDiv) {
      let total = 0;
      const selects = shipDiv.querySelectorAll(".upgrade-select");
      selects.forEach(select => {
        const extras = upgrades[select.dataset.category];
        if (select.value && extras && extras[select.value]) {
          total += extras[select.value];
        }
      });
      return total;
    }
  
    function getPilotPoints(shipDiv) {
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      if (pilotSelect && pilotSelect.value) {
        return ships["X-Wing"][pilotSelect.value].cost;
      }
      return 0;
    }
  
    window.xwingRules = {
      addShip: addShip,
      calculateUpgradePoints: calculateUpgradePoints,
      getPilotPoints: getPilotPoints,
      getUpgradePoints: calculateUpgradePoints
    };
  })();