(function () {
  // Dane dla statków YT-2400 – instrukcje dla pilotów
  const ships = {
      "YT-2400": {
          "Dash Rendar": { cost: 7, upgradeLimit: 12, talentSlots: 1, crewSlots: 2, gunnerSlots: 1, missileSlots: 1, modificationSlots: 1, illicitSlots: 1, titleSlots: 1 },
          "Leebo": { cost: 6, upgradeLimit: 10, crewSlots: 1, gunnerSlots: 1, missileSlots: 1, modificationSlots: 1, titleSlots: 1 },
          "Wild Spacer": { cost: 5, upgradeLimit: 8, crewSlots: 1, missileSlots: 1, modificationSlots: 1 }
      }
  };

  const yt2400Extras = {
      "Talent Upgrade": { "Trick Shot": 3, "Lone Wolf": 3, "Marksmanship": 2, "Rocket Barrage": 4 },
      "Crew Upgrade": { "C-3PO": 6, "Leia Organa": 5, "K-2SO": 4 },
      "Gunner Upgrade": { "Veteran Tail Gunner": 4, "Bistan": 5 },
      "Missile Upgrade": { "Proton Rockets": 5, "Concussion Missiles": 4 },
      "Modification": { "Engine Upgrade": 6, "Shield Upgrade": 5 },
      "Illicit": { "Contraband Cybernetics": 4, "Hotshot Blaster": 5 },
      "Title": { "Outrider": 0 }
  };

  function addShip() {
      const squadronDiv = document.getElementById("squadron");
      const shipDiv = document.createElement("div");
      shipDiv.className = "ship-section yt2400";

      const shipSelect = document.createElement("select");
      shipSelect.className = "ship-select";
      shipSelect.innerHTML = `<option value="YT-2400">YT-2400</option>`;
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
      updatePilotOptions(shipDiv, "YT-2400");
  }

  function updatePilotOptions(shipDiv, selectedShip) {
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
      if (ships[selectedShip]) {
          for (let pilot in ships[selectedShip]) {
              const pilotData = ships[selectedShip][pilot];
              pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${pilotData.cost} pkt, Talent: ${pilotData.talentSlots}, Crew: ${pilotData.crewSlots}, Gunner: ${pilotData.gunnerSlots}, Missile: ${pilotData.missileSlots}, Modification: ${pilotData.modificationSlots}, Illicit: ${pilotData.illicitSlots}, Title: ${pilotData.titleSlots})</option>`;
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

      const pilotData = ships["YT-2400"][pilotSelect.value];

      if (pilotData.talentSlots) {
          for (let i = 1; i <= pilotData.talentSlots; i++) {
              createUpgradeSelect(upgradeSection, "Talent Upgrade", yt2400Extras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
          }
      }
      if (pilotData.crewSlots) {
          for (let i = 1; i <= pilotData.crewSlots; i++) {
              createUpgradeSelect(upgradeSection, "Crew Upgrade", yt2400Extras["Crew Upgrade"], `No Crew Upgrade (Slot ${i})`);
          }
      }
      if (pilotData.gunnerSlots) {
          for (let i = 1; i <= pilotData.gunnerSlots; i++) {
              createUpgradeSelect(upgradeSection, "Gunner Upgrade", yt2400Extras["Gunner Upgrade"], `No Gunner Upgrade (Slot ${i})`);
          }
      }
      if (pilotData.missileSlots) {
          for (let i = 1; i <= pilotData.missileSlots; i++) {
              createUpgradeSelect(upgradeSection, "Missile Upgrade", yt2400Extras["Missile Upgrade"], `No Missile Upgrade (Slot ${i})`);
          }
      }
      if (pilotData.modificationSlots) {
          for (let i = 1; i <= pilotData.modificationSlots; i++) {
              createUpgradeSelect(upgradeSection, "Modification", yt2400Extras["Modification"], `No Modification (Slot ${i})`);
          }
      }
      if (pilotData.illicitSlots) {
          for (let i = 1; i <= pilotData.illicitSlots; i++) {
              createUpgradeSelect(upgradeSection, "Illicit", yt2400Extras["Illicit"], `No Illicit Upgrade (Slot ${i})`);
          }
      }
      if (pilotData.titleSlots) {
          for (let i = 1; i <= pilotData.titleSlots; i++) {
              createUpgradeSelect(upgradeSection, "Title", yt2400Extras["Title"], `No Title Upgrade (Slot ${i})`);
          }
      }

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
      const upgradeLimit = ships["YT-2400"][pilotSelect.value]?.upgradeLimit || 0;
      pointsDiv.innerHTML = `Użyte punkty: ${upgradePoints} / ${upgradeLimit}`;
      if (typeof updateGlobalTotalPoints === 'function') {
          updateGlobalTotalPoints();
      }
  }

  function calculateUpgradePoints(shipDiv) {
      let total = 0;
      const selects = shipDiv.querySelectorAll(".upgrade-select");
      selects.forEach(select => {
          const extras = yt2400Extras[select.dataset.category];
          if (select.value && extras && extras[select.value]) {
              total += extras[select.value];
          }
      });
      return total;
  }

  function getPilotPoints(shipDiv) {
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      if (pilotSelect && pilotSelect.value) {
          return ships["YT-2400"][pilotSelect.value].cost;
      }
      return 0;
  }

  window.yt2400Rules = {
      addShip: addShip,
      calculateUpgradePoints: calculateUpgradePoints,
      getPilotPoints: getPilotPoints,
      getUpgradePoints: calculateUpgradePoints
  };
})();
