// Script JavaScript do zarządzania flotą Y-Wing (z presetami, natychmiastowym liczeniem punktów)
(function () {
  // Dane dla statków Y-Wing – instrukcje dla pilotów
  const ships = {
    "Y-Wing": {
      "Horton Salm": { cost: 4, upgradeLimit: 16 },
      "Dutch Vander": { cost: 4, upgradeLimit: 10 },
      "Dutch Vander Battle of Yavin": { cost: 4, upgradeLimit: 10 },
      "Duch Bander Gold Leader": { cost: 4, upgradeLimit: 10 },
      "Pops Krail Battle of Yavin": { cost: 3, upgradeLimit: 10 },
      "Norra Wexley": { cost: 5, upgradeLimit: 25 },
      "Pops Krail": { cost: 3, upgradeLimit: 4 },
      "Evaana Verliane": { cost: 3, upgradeLimit: 5, modificationSlots: 2 },
      "Gold Squadron Veteran": { cost: 3, upgradeLimit: 8, modificationSlots: 1 },
      "Gray Squadron Bomber": { cost: 4, upgradeLimit: 18, modificationSlots: 1 },
      "Hol Okand Battle of Yavin": { cost: 3, upgradeLimit: 10 },
      "Horton Salm Battle of Yavin": { cost: 4, upgradeLimit: 10 },
      "Dex Tiree Battle of Yavin": { cost: 4, upgradeLimit: 10 }
    }
  };

  // Wszystkie ulepszenia i ich koszty
  const upgrades = {
    "Bombs":             { "Standard Bombs": 4, "Advanced Bombs": 6, "Proton Bombs": 5, "Proximity Mines": 5 },
    "Gunner":            { "Standard Gunner": 3, "Veteran Gunner": 5 },
    "Turret":            { "Standard Turret": 2, "Advanced Turret": 3, "Ion Cannon Turret": 5, "Dorsal Turret": 4 },
    "Talent Upgrade":    { "Outmaneuver": 6, "Lone Wolf": 4 },
    "Torpedo Upgrade":   { "Proton Torpedoes": 6, "Advanced Proton Torpedoes": 8 },
    "Missile Upgrade":   { "Concussion Missiles": 5, "Cluster Missiles": 6 },
    "Astromech Upgrade": { "R2-D2": 5, "R5-D4": 3, "Targeting Astromech": 4, "R4 Astromech": 2, "Precise Astromech": 3 },
    "Modification Upgrade": { "Shield Upgrade": 6, "Stealth Device": 5 }
  };

  // Presety historyczne dla wybranych pilotów
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

  function addShip() {
    const squadronDiv = document.getElementById("squadron");
    const shipDiv = document.createElement("div");
    shipDiv.className = "ship-section ywing";

    // Wybór modelu
    const shipSelect = document.createElement("select");
    shipSelect.className = "ship-select";
    shipSelect.innerHTML = `<option value="Y-Wing">Y-Wing</option>`;
    shipSelect.onchange = () => updatePilotOptions(shipDiv);
    shipDiv.appendChild(shipSelect);

    // Wybór pilota
    const pilotSelect = document.createElement("select");
    pilotSelect.className = "pilot-select";
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    pilotSelect.onchange = () => updateUpgrades(shipDiv);
    shipDiv.appendChild(pilotSelect);

    // Sekcja ulepszeń i punktów
    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "upgrade-section";
    shipDiv.appendChild(upgradeDiv);

    const ptsDiv = document.createElement("div");
    ptsDiv.className = "upgrade-points";
    shipDiv.appendChild(ptsDiv);

    squadronDiv.appendChild(shipDiv);

    updatePilotOptions(shipDiv);

    // automatyczne odświeżenie sumy globalnej
    updateGlobalTotalPoints();
  }

  function updatePilotOptions(shipDiv) {
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    Object.entries(ships["Y-Wing"]).forEach(([pilot, data]) => {
      pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${data.cost} pkt)</option>`;
    });
    // domyślny wybór pierwszego pilota, jeśli dostępny
    if (pilotSelect.options.length > 1) {
      pilotSelect.selectedIndex = 1;
    }
    updateUpgrades(shipDiv);
  }

  function updateUpgrades(shipDiv) {
    const pilotSel = shipDiv.querySelector(".pilot-select");
    const upSec    = shipDiv.querySelector(".upgrade-section");
    const ptsDiv   = shipDiv.querySelector(".upgrade-points");
    upSec.innerHTML = "";
    ptsDiv.innerHTML = "";

    if (!pilotSel.value) return;

    const data = ships["Y-Wing"][pilotSel.value];

    // Preset historyczny?
    if (presetsByPilot[pilotSel.value]) {
      let total = 0;
      presetsByPilot[pilotSel.value].forEach(([cat, val]) => {
        const sel = document.createElement("select");
        sel.className = "upgrade-select";
        sel.disabled = true;
        sel.dataset.category = cat;
        sel.innerHTML = `<option>${val}</option>`;
        total += upgrades[cat][val] || 0;
        upSec.appendChild(sel);
      });
      ptsDiv.innerText = `Użyte punkty: ${total} / ${data.upgradeLimit}`;
      updateGlobalTotalPoints();
      return;
    }

    // Sloty standardowe
    Object.entries(upgrades).forEach(([category, opts]) => {
      // ograniczenia pilotów
      if (category === "Gunner" && pilotSel.value !== "Norra Wexley") return;
      if (category === "Talent Upgrade" && ["Horton Salm","Evaana Verliane"].includes(pilotSel.value)) return;

      // Dutch Vander ma dwa sloty Bombs
      if (category === "Bombs" && pilotSel.value === "Dutch Vander") {
        createSlot(upSec, category, opts, "No Bombs (Slot 1)");
        createSlot(upSec, category, opts, "No Bombs (Slot 2)");
        return;
      }

      // Evaana Verliane ma 2 sloty Modification
      if (category === "Modification Upgrade" && pilotSel.value === "Evaana Verliane") {
        for (let i = 1; i <= (data.modificationSlots || 1); i++) {
          createSlot(upSec, category, opts, `No Modification (Slot ${i})`);
        }
        return;
      }

      // pozostałe pojedyncze sloty
      createSlot(upSec, category, opts, `No ${category}`);
    });

    updateUpgradePointsDisplay(shipDiv);
  }

  function createSlot(container, category, opts, defaultText) {
    const select = document.createElement("select");
    select.className = "upgrade-select";
    select.dataset.category = category;
    select.innerHTML = `<option value=''>${defaultText}</option>` +
      Object.entries(opts)
            .map(([up, cost]) => `<option value='${up}'>${up} (${cost} pkt)</option>`)
            .join('');
    select.onchange = () => updateUpgradePointsDisplay(container.closest('.ywing'));
    container.appendChild(select);
  }

  function updateUpgradePointsDisplay(shipDiv) {
    const pilotName = shipDiv.querySelector(".pilot-select").value;
    const pilotCost = ships["Y-Wing"][pilotName]?.cost || 0;
    const limit     = ships["Y-Wing"][pilotName]?.upgradeLimit || 0;
    const used      = Array.from(shipDiv.querySelectorAll(".upgrade-select"))
      .reduce((sum, sel) => sum + (upgrades[sel.dataset.category]?.[sel.value] || 0), 0);
    shipDiv.querySelector(".upgrade-points").innerText =
      `Pilot: ${pilotCost} pkt, Użyte ulepszenia: ${used} / ${limit}`;

    updateGlobalTotalPoints();
  }

  function getPilotPoints(shipDiv) {
    const p = shipDiv.querySelector(".pilot-select").value;
    return p ? ships["Y-Wing"][p].cost : 0;
  }

  function calculateUpgradePoints(shipDiv) {
    return Array.from(shipDiv.querySelectorAll(".upgrade-select"))
      .reduce((sum, sel) => sum + (upgrades[sel.dataset.category]?.[sel.value] || 0), 0);
  }

  function updateGlobalTotalPoints() {
    const total = Array.from(document.querySelectorAll(".ship-section.ywing"))
      .reduce((sum, sec) => sum + getPilotPoints(sec) + calculateUpgradePoints(sec), 0);
    const globalDiv = document.getElementById("global-points");
    if (globalDiv) globalDiv.innerText = `Suma punktów: ${total}`;
  }

  // Eksport API
  window.ywingRules = {
    addShip,
    getPilotPoints,
    getUpgradePoints: calculateUpgradePoints
  };
  window.updateGlobalTotalPoints = updateGlobalTotalPoints;
})();
