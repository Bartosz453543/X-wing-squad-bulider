(function () {
  // Dane dla statków YT-2400 – instrukcje dla pilotów
  const ships = {
    "YT-2400": {
      "Dash Rendar": { cost: 7, upgradeLimit: 12, talentSlots: 1, crewSlots: 2, gunnerSlots: 0, missileSlots: 1, modificationSlots: 1, illicitSlots: 1, titleSlots: 0 },
      "Dash Rendar Freighter for Hire": { cost: 7, upgradeLimit: 12, talentSlots: 1, crewSlots: 2, gunnerSlots: 0, missileSlots: 1, modificationSlots: 1, illicitSlots: 1, titleSlots: 1 },
      "Dash Rendar In it for Himself": { cost: 7, upgradeLimit: 12, talentSlots: 1, crewSlots: 2, gunnerSlots: 1, missileSlots: 1, modificationSlots: 1, illicitSlots: 1, titleSlots: 0 },
      "Leebo": { cost: 6, upgradeLimit: 10, crewSlots: 1, gunnerSlots: 0, missileSlots: 1, modificationSlots: 1, titleSlots: 1, illicitSlots: 2 },
      "Leebo He Thinks He's Funny": { cost: 6, upgradeLimit: 10, talentSlots: 1, missileSlots: 1, titleSlots: 1 },
      "Leebo Wisdom of Ages": { cost: 6, upgradeLimit: 10, crewSlots: 1, gunnerSlots: 0, missileSlots: 1, modificationSlots: 1, titleSlots: 1, illicitSlots: 2, titleSlots: 1 },
      "Wild Spacer": { cost: 5, upgradeLimit: 8, crewSlots: 1, missileSlots: 1, modificationSlots: 1 },
      
    }
  };

  // Ulepszenia dla YT-2400
  const yt2400Extras = {
    "Talent Upgrade": {"Trick Shot": 3,"Lone Wolf": 3,"Marksmanship": 2,"Rocket Barrage": 4,"Mercenary": 4,"Efficient Processing": 3},
    "Crew Upgrade": { "C-3PO": 6, "Leia Organa": 5, "K-2SO": 4, "Lebbo": 3 },
    "Gunner Upgrade": { "Veteran Tail Gunner": 4, "Bistan": 5 },
    "Missile Upgrade": { "Proton Rockets": 5, "Concussion Missiles": 4, "Seeker Missiles": 5 },
    "Modification": { "Engine Upgrade": 6, "Shield Upgrade": 5 },
    "Illicit": { "Contraband Cybernetics": 4, "Hotshot Blaster": 5 },
    "Title": { "Outrider": 0 }
  };

  function addShip() {
    const squadronDiv = document.getElementById("squadron");
    const shipDiv = document.createElement("div");
    shipDiv.className = "ship-section yt2400";

    // wybór typu statku
    const shipSelect = document.createElement("select");
    shipSelect.className = "ship-select";
    shipSelect.innerHTML = `<option value="YT-2400">YT-2400</option>`;
    shipDiv.appendChild(shipSelect);

    // wybór pilota
    const pilotSelect = document.createElement("select");
    pilotSelect.className = "pilot-select";
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    pilotSelect.onchange = () => updateUpgrades(shipDiv);
    shipDiv.appendChild(pilotSelect);

    // kontener na upgrade'y
    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "upgrade-section";
    shipDiv.appendChild(upgradeDiv);

    // informacja o punktach
    const pointsDiv = document.createElement("div");
    pointsDiv.className = "upgrade-points";
    shipDiv.appendChild(pointsDiv);

    squadronDiv.appendChild(shipDiv);
    updatePilotOptions(shipDiv, "YT-2400");
  }

  function updatePilotOptions(shipDiv, selectedShip) {
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    Object.keys(ships[selectedShip]).forEach(pilot => {
      const data = ships[selectedShip][pilot];
      // upewniamy się, że value jest dokładnie pilotem
      pilotSelect.innerHTML += `<option value="${pilot}">${pilot} (${data.cost} pkt)</option>`;
    });
    updateUpgrades(shipDiv);
  }

  function updateUpgrades(shipDiv) {
    const pilot = shipDiv.querySelector(".pilot-select").value;
    // debug: zobaczmy dokładny ciąg
    console.log("Wybrany pilot:", JSON.stringify(pilot));

    const upSec = shipDiv.querySelector(".upgrade-section");
    const ptsDiv = shipDiv.querySelector(".upgrade-points");
    upSec.innerHTML = "";
    ptsDiv.innerHTML = "";
    if (!pilot) return;

    // preset dla Dash Rendar In it for Himself
    if (pilot === "Dash Rendar In it for Himself") {
      applyPreset(shipDiv, [
        ["Talent Upgrade", "Mercenary"],
        ["Missile Upgrade", "Seeker Missiles"],
        ["Crew Upgrade", "Lebbo"],
        ["Title", "Outrider"]
      ], ships["YT-2400"][pilot].upgradeLimit);
      return;
    }

    // preset dla Leebo He Thinks He's Funny
    if (pilot === "Leebo He Thinks He's Funny") {
      applyPreset(shipDiv, [
        ["Talent Upgrade", "Efficient Processing"],
        ["Missile Upgrade", "Seeker Missiles"],
        ["Title", "Outrider"]
      ], ships["YT-2400"][pilot].upgradeLimit);
      return;
    }

    // w pozostałych przypadkach generujemy sloty zgodnie z danymi
    const data = ships["YT-2400"][pilot];
    if (data.talentSlots)      for (let i = 1; i <= data.talentSlots;      i++) createUpgradeSelect(upSec, "Talent Upgrade", yt2400Extras["Talent Upgrade"], `No Talent Upgrade (Slot ${i})`);
    if (data.crewSlots)        for (let i = 1; i <= data.crewSlots;        i++) createUpgradeSelect(upSec, "Crew Upgrade",   yt2400Extras["Crew Upgrade"],   `No Crew Upgrade (Slot ${i})`);
    if (data.gunnerSlots)      for (let i = 1; i <= data.gunnerSlots;      i++) createUpgradeSelect(upSec, "Gunner Upgrade", yt2400Extras["Gunner Upgrade"], `No Gunner Upgrade (Slot ${i})`);
    if (data.missileSlots)     for (let i = 1; i <= data.missileSlots;     i++) createUpgradeSelect(upSec, "Missile Upgrade",yt2400Extras["Missile Upgrade"],`No Missile Upgrade (Slot ${i})`);
    if (data.modificationSlots)for (let i = 1; i <= data.modificationSlots;i++) createUpgradeSelect(upSec, "Modification",   yt2400Extras["Modification"],   `No Modification (Slot ${i})`);
    if (data.illicitSlots)     for (let i = 1; i <= data.illicitSlots;     i++) createUpgradeSelect(upSec, "Illicit",        yt2400Extras["Illicit"],        `No Illicit Upgrade (Slot ${i})`);
    if (data.titleSlots)       for (let i = 1; i <= data.titleSlots;       i++) createUpgradeSelect(upSec, "Title",          yt2400Extras["Title"],          `No Title Upgrade (Slot ${i})`);

    updateUpgradePointsDisplay(shipDiv);
  }

  function applyPreset(shipDiv, presets, limit) {
    const upSec = shipDiv.querySelector(".upgrade-section");
    const ptsDiv = shipDiv.querySelector(".upgrade-points");
    let total = 0;
    presets.forEach(([cat, val]) => {
      const sel = document.createElement("select");
      sel.className = "upgrade-select";
      sel.disabled = true;
      sel.dataset.category = cat;
      sel.innerHTML = `<option>${val}</option>`;
      total += yt2400Extras[cat]?.[val] || 0;
      upSec.appendChild(sel);
    });
    ptsDiv.innerHTML = `Użyte punkty: ${total} / ${limit}`;
    if (typeof updateGlobalTotalPoints === 'function') updateGlobalTotalPoints();
  }

  function createUpgradeSelect(container, category, optionsObj, defaultText) {
    const sel = document.createElement("select");
    sel.className = "upgrade-select";
    sel.dataset.category = category;
    sel.innerHTML = `<option value=''>${defaultText}</option>`;
    for (let key in optionsObj) {
      sel.innerHTML += `<option value='${key}'>${key} (${optionsObj[key]} pkt)</option>`;
    }
    sel.onchange = () => updateUpgradePointsDisplay(container.parentNode);
    container.appendChild(sel);
  }

  function updateUpgradePointsDisplay(shipDiv) {
    const ptsDiv = shipDiv.querySelector(".upgrade-points");
    const pilot = shipDiv.querySelector(".pilot-select").value;
    const used = Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, s) => {
      const cat = s.dataset.category, val = s.value;
      return sum + ((val && yt2400Extras[cat][val]) || 0);
    }, 0);
    const limit = ships["YT-2400"][pilot].upgradeLimit;
    ptsDiv.innerHTML = `Użyte punkty: ${used} / ${limit}`;
    if (typeof updateGlobalTotalPoints === 'function') updateGlobalTotalPoints();
  }

  function calculateUpgradePoints(shipDiv) {
    return Array.from(shipDiv.querySelectorAll(".upgrade-select")).reduce((sum, s) => {
      const cat = s.dataset.category, val = s.value;
      return sum + ((val && yt2400Extras[cat][val]) || 0);
    }, 0);
  }

  function getPilotPoints(shipDiv) {
    const sel = shipDiv.querySelector(".pilot-select");
    return sel.value ? ships["YT-2400"][sel.value].cost : 0;
  }

  window.yt2400Rules = {
    addShip,
    calculateUpgradePoints,
    getPilotPoints,
    getUpgradePoints: calculateUpgradePoints
  };
})();
