(function(){
    // Dane dla statków X‑wing
    const ships = {
      "T-65 X-wing": {
        "Luke Skywalker": { cost: 6, upgradeLimit: 24, force: 2 },
        "Wedge Antilles": { cost: 6, upgradeLimit: 20, force: 0, talentSlots: 2 },
        "Biggs Darklighter": { cost: 5, upgradeLimit: 5, force: 0, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
        "Wes Janson": { cost: 5, upgradeLimit: 17, force: 0, missileSlots: 1 },
        "Corran Horn": { cost: 4, upgradeLimit: 9, force: 0, missileSlots: 1, noModifications: true },
        "Thane Kyrell": { cost: 4, upgradeLimit: 6, force: 0, missileSlots: 1, noModifications: true },
        "Garven Dreis": { cost: 4, upgradeLimit: 6, force: 0, missileSlots: 1, noModifications: true },
        "Jek Porkins": { cost: 4, upgradeLimit: 6, force: 0, missileSlots: 1, noModifications: true },
        "Kubllbee Sperado": { cost: 4, upgradeLimit: 9, force: 0, missileSlots: 1, illegalUpgrades: 1 }, 
        "Leevan Tenza": { cost: 4, upgradeLimit: 9, force: 0, missileSlots: 1, noModifications: true },
        "Red Squadron Veteran": { cost: 4, upgradeLimit: 8, force: 0, missileSlots: 1, noModifications: true },
        "Blue Squadron Escort": { cost: 5, upgradeLimit: 18, force: 0, missileSlots: 1, noModifications: true },
        "Edrio Two Tubes": { cost: 5, upgradeLimit: 18, force: 0, missileSlots: 1, noModifications: true }, 
        "Cabern Angels Zealot": { cost: 5, upgradeLimit: 15, force: 0 } 
      },
    };
  
    const upgrades = {
      "Force Upgrade": { "Sense": 5, "Supernatural Reflexes": 10, "Brilliant Evasion": 6 },
      "Talent Upgrade": { "Outmaneuver": 6, "Lone Wolf": 4 },
      "Torpedo Upgrade": { "Proton Torpedoes": 6, "Advanced Proton Torpedoes": 8 },
      "Missile Upgrade": { "Concussion Missiles": 5, "Cluster Missiles": 6 },
      "Astromech Upgrade": { "R2-D2": 5, "R5-D4": 3 },
      "Modification Upgrade": { "Shield Upgrade": 6, "Stealth Device": 5 },
      "Configuration Upgrade": { "S-Foils": 0 },
      "Illegal Upgrade": { "Illegal Upgrade 1": 10, "Illegal Upgrade 2": 12 }  // Przykłady nielegalnych upgrade'ów
    };
  
    // Funkcja pomocnicza do pobierania liczby slotów dla danej kategorii
    function getSlots(pilotData, category) {
        if (category === "Force Upgrade") {
          return pilotData.force && pilotData.force > 0 ? pilotData.force : 0;
        }
        if (category === "Talent Upgrade" && pilotData.talentSlots) {
          return pilotData.talentSlots;
        }
        if (category === "Torpedo Upgrade" && pilotData.torpedoSlots) {
          return pilotData.torpedoSlots;
        }
        if (category === "Astromech Upgrade" && pilotData.astromechSlots) {
          return pilotData.astromechSlots;
        }
        if (category === "Modification Upgrade" && pilotData.modificationSlots) {
          return pilotData.modificationSlots;
        }
        if (category === "Configuration Upgrade" && pilotData.configurationSlots) {
          return pilotData.configurationSlots;
        }
        if (category === "Illegal Upgrade" && pilotData.illegalUpgrades) {
            return pilotData.illegalUpgrades; // Kubllbee Sperado ma dostęp do nielegalnych upgrade'ów
        }
        // Domyślnie 1 slot
        return 1;
    }
  
    // Funkcja dodająca statek X‑wing
    function addShip(){
      const squadronDiv = document.getElementById("squadron");
      const shipDiv = document.createElement("div");
      // Dodajemy klasę 'ship-section' oraz identyfikator typu 'xwing'
      shipDiv.className = "ship-section xwing";
      
      // Select dla wyboru statku
      const shipSelect = document.createElement("select");
      shipSelect.innerHTML = `<option value=''>Wybierz statek</option>`;
      for (let ship in ships) {
        shipSelect.innerHTML += `<option value='${ship}'>${ship}</option>`;
      }
      shipSelect.onchange = function() {
        updatePilotOptions(shipDiv, shipSelect.value);
      };
      shipDiv.appendChild(shipSelect);
  
      // Select dla pilota
      const pilotSelect = document.createElement("select");
      pilotSelect.className = "pilot-select";
      pilotSelect.innerHTML = `<option value=''>Wybierz pilota</option>`;
      pilotSelect.onchange = function() {
        updateUpgrades(shipDiv);
      };
      shipDiv.appendChild(pilotSelect);
  
      // Sekcja dla upgrade'ów
      const upgradeDiv = document.createElement("div");
      upgradeDiv.className = "upgrade-section";
      shipDiv.appendChild(upgradeDiv);
  
      // Miejsce na wyświetlanie punktów użytych w tym statku
      const pointsDiv = document.createElement("div");
      pointsDiv.className = "upgrade-points";
      shipDiv.appendChild(pointsDiv);
  
      squadronDiv.appendChild(shipDiv);
    }
  
    function updatePilotOptions(shipDiv, selectedShip) {
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      pilotSelect.innerHTML = `<option value=''>Wybierz pilota</option>`;
      if (ships[selectedShip]) {
        for (let pilot in ships[selectedShip]) {
          pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${ships[selectedShip][pilot].cost} pkt)</option>`;
        }
      }
      updateUpgrades(shipDiv);
      // Zaktualizuj globalne punkty
      updateGlobalTotalPoints();
    }
  
    function updateUpgrades(shipDiv) {
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      const upgradeSection = shipDiv.querySelector(".upgrade-section");
      const pointsDiv = shipDiv.querySelector(".upgrade-points");
      upgradeSection.innerHTML = "";
      pointsDiv.innerHTML = "";
  
      if (!pilotSelect.value) return;
  
      const selectedShip = shipDiv.querySelector("select").value;
      const pilotData = ships[selectedShip][pilotSelect.value];
      let totalUpgradePointsForShip = 0;
  
      // Iterujemy po kategoriach upgrade'ów
      for (let category in upgrades) {
        // Pomijamy Talent Upgrade dla Luke'a i Biggs Darklighter (przykładowe ograniczenie)
        if ((pilotSelect.value === "Luke Skywalker" || pilotSelect.value === "Biggs Darklighter") && category === "Talent Upgrade") { 
          continue;
        }
        // Pomijamy rakiety dla Luke'a Skywalker, Wedge Antillesa oraz Biggs Darklightera
        if ((pilotSelect.value === "Luke Skywalker" || pilotSelect.value === "Wedge Antilles" || pilotSelect.value === "Biggs Darklighter"|| pilotSelect.value === "Garven Dreis" || pilotSelect.value === "Jek Porkins" || pilotSelect.value === "Red Squadron Veteran" || pilotSelect.value === "Blue Squadron Escort" || pilotSelect.value === "Cabern Angels Zealot" ) && category === "Missile Upgrade") {
          continue;
        }
        if ((pilotSelect.value === "Biggs Darklighter" || pilotSelect.value === "Wes Janson" || pilotSelect.value === "Corran Horn" || pilotSelect.value === "Thane Kyrell" || pilotSelect.value === "Leevan Tenza" || pilotSelect.value === "Red Squadron Veteran" || pilotSelect.value === "Edrio Two Tubes" || pilotSelect.value === "Cabern Angels Zealot") && category === "Torpedo Upgrade") {
            continue;
        }
        if ((pilotSelect.value === "Corran Horn" || pilotSelect.value === "Thane Kyrell" || pilotSelect.value === "Jek Porkins" || pilotSelect.value === "Leevan Tenza" || pilotSelect.value === "Red Squadron Veteran" || pilotSelect.value === "Edrio Two Tubes") && category === "Modification Upgrade") {
            continue;
        }
        if ((pilotSelect.value === "Corran Horn" || pilotSelect.value === "Wes Janson" || pilotSelect.value === "Thane Kyrell" || pilotSelect.value === "Jek Porkins" || pilotSelect.value === "Luke Skywalker" || pilotSelect.value === "Wedge Antilles" || pilotSelect.value === "Biggs Darklighter"|| pilotSelect.value === "Garven Dreis" || pilotSelect.value === "Jek Porkins" || pilotSelect.value === "Red Squadron Veteran" || pilotSelect.value === "Blue Squadron Escort" ) && category === "Illegal Upgrade") {
            continue;
        } 
        if((pilotSelect.value === "Blue Squadron Escort" || pilotSelect.value === "Edrio Two Tubes" || pilotSelect.value === "Cabern Angels Zealot" ) && category === "Talent Upgrade"){
            continue;
        }
        if((pilotSelect.value === "Edrio Two Tubes" ) && category === "Astromech Upgrade"){
            continue;
        }
        // Pomijamy kategorię "Illegal Upgrade" dla wszystkich, oprócz Kubllbee Sperado
        if (selectedShip === "T-65 X-wing" && pilotSelect.value === "Kubllbee Sperado" && category === "Illegal Upgrade") {
            let slots = getSlots(pilotData, category);
            for (let i = 0; i < slots; i++) {
                const select = document.createElement("select");
                select.className = "upgrade-select";
                select.innerHTML = `<option value=''>No ${category} (Slot ${i+1})</option>`;
                for (let upgrade in upgrades[category]) {
                  select.innerHTML += `<option value='${upgrade}'>${upgrade} (${upgrades[category][upgrade]} pkt)</option>`;
                }
                select.onchange = function() {
                  totalUpgradePointsForShip = calculateUpgradePoints(shipDiv);
                  pointsDiv.innerHTML = `Użyte punkty: ${totalUpgradePointsForShip}/${pilotData.upgradeLimit}`;
                  updateGlobalTotalPoints();
                };
                upgradeSection.appendChild(select);
            }
            continue; // Pomijamy inne upgrade'y dla Kubllbee Sperado, aby nie dodawano innych kategorii
        }
         
        // Pobieramy liczbę slotów dla danej kategorii (domyślnie 1 lub wartość z pilotData)
        let slots = getSlots(pilotData, category);
  
        for (let i = 0; i < slots; i++) {
          const select = document.createElement("select");
          select.className = "upgrade-select";
          select.innerHTML = `<option value=''>No ${category} (Slot ${i+1})</option>`;
          for (let upgrade in upgrades[category]) {
            select.innerHTML += `<option value='${upgrade}'>${upgrade} (${upgrades[category][upgrade]} pkt)</option>`;
          }
          select.onchange = function() {
            totalUpgradePointsForShip = calculateUpgradePoints(shipDiv);
            pointsDiv.innerHTML = `Użyte punkty: ${totalUpgradePointsForShip}/${pilotData.upgradeLimit}`;
            updateGlobalTotalPoints();
          };
          upgradeSection.appendChild(select);
        }
      }
    }
  
    function calculateUpgradePoints(shipDiv) {
      let total = 0;
      const selects = shipDiv.querySelectorAll(".upgrade-select");
      selects.forEach(select => {
        if (select.value) {
          if (select.value === 'illegal') {
            total += 3;
          } else {
            for (let category in upgrades) {
              if (upgrades[category][select.value]) {
                total += upgrades[category][select.value];
              }
            }
          }
        }
      });
      return total;
    }
  
    // Funkcje pomocnicze do globalnego sumowania punktów:
    function getPilotPoints(shipDiv) {
      let points = 0;
      const shipSelect = shipDiv.querySelector("select");
      const pilotSelect = shipDiv.querySelector(".pilot-select");
      if (shipSelect.value && pilotSelect.value) {
        const pilotData = ships[shipSelect.value][pilotSelect.value];
        points = pilotData.cost;
      }
      return points;
    }
    function getUpgradePoints(shipDiv) {
      return calculateUpgradePoints(shipDiv);
    }
  
    // Udostępniamy funkcje poprzez namespace xwingRules
    window.xwingRules = {
      addShip: addShip,
      getPilotPoints: getPilotPoints,
      getUpgradePoints: getUpgradePoints
    };
  
    // Zakładamy, że funkcja globalna updateGlobalTotalPoints jest zdefiniowana w HTML
})();
