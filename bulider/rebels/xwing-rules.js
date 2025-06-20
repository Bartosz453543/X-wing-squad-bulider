(function () {
  // Dane dla statków X-Wing – instrukcje dla pilotów
  const ships = {
    "X-Wing": {
      "Luke Skywalker":                 { cost: 5,  upgradeLimit: 5,  force: 2,  torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Wedge Antilles Battle Over Endor": { cost: 5,  upgradeLimit: 11, force: 0,  talentSlots: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Wedge Antilles":                 { cost: 5,  upgradeLimit: 11, talentSlots: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Luke Skywalker Battle of Yavin": { cost: 5,  upgradeLimit: 5,  talentSlots: 1, force: 2,  torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Luke Skywalker Red Five":        { cost: 5,  upgradeLimit: 5,  talentSlots: 1, force: 2,  torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Wedge Antilles Battle of Yavin": { cost: 5,  upgradeLimit: 11, force: 0,  talentSlots: 2, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Yendor Battle of Endor":         { cost: 4,  upgradeLimit: 9,  talentSlots: 1, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Wes Janson":                     { cost: 5,  upgradeLimit: 17, talentSlots: 1, missileSlots: 1,  astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Corran Horn":                    { cost: 4,  upgradeLimit: 9,  talentSlots: 1, missileSlots: 1,  astromechSlots: 1, configurationSlots: 1 },
      "Thane Kyrell":                   { cost: 4,  upgradeLimit: 6,  talentSlots: 1, missileSlots: 1,  astromechSlots: 1, configurationSlots: 1 },
      "Garven Dreis Battle of Yavin":   { cost: 5,  upgradeLimit: 8,  torpedoSlots: 1, astromechSlots: 1 },
      "Garven Dreis":                   { cost: 5,  upgradeLimit: 17, talentSlots: 1, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Jek Porkins Battle of Yavin":    { cost: 5,  upgradeLimit: 8,  torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1 },
      "Jek Porkins":                    { cost: 4,  upgradeLimit: 7,  talentSlots: 1, torpedoSlots: 1, astromechSlots: 1, configurationSlots: 1 },
      "Jek Porkins Red Six":            { cost: 5,  upgradeLimit: 8,  torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1 },
      "Endy Idele Battle of Endor":     { cost: 5,  upgradeLimit: 8,  torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1 },
      "Kullbee Sperado":                { cost: 4,  upgradeLimit: 9,  talentSlots: 1, missileSlots: 1,  astromechSlots: 1, illicitUpgrades: 1, configurationSlots: 1 },
      "Biggs Darklighter":              { cost: 5,  upgradeLimit: 8,  torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1 },
      "Biggs Darklighter Battle of Yavin": { cost: 6, upgradeLimit: 5, force: 0, torpedoSlots: 1, astromechSlots: 1, modificationSlots: 1, configurationSlots: 1 },
      "Leevan Tenza":                   { cost: 4,  upgradeLimit: 9,  talentSlots: 1, missileSlots: 1,  astromechSlots: 1, illicitUpgrades: 1, configurationSlots: 1 },
      "Red Squadron Veteran":           { cost: 4,  upgradeLimit: 8,  talentSlots: 1, astromechSlots: 1, configurationSlots: 1 },
      "Blue Squadron Escort":           { cost: 5,  upgradeLimit: 18, astromechSlots: 1, torpedoSlots: 1, configurationSlots: 1, modificationSlots: 1 },
      "Edrio Two Tubes":                { cost: 5,  upgradeLimit: 18, missileSlots: 1, illicitUpgrades: 1, configurationSlots: 1 },
      "Cabern Angels Zealot":           { cost: 5,  upgradeLimit: 15, astromechSlots: 1, illicitUpgrades: 1, configurationSlots: 1, modificationSlots: 1 }
    }
  };

  const upgrades = {
    "Force Upgrade": {
      "Compassion": 1, "Predictive Shot": 1, "Brilliant Evasion": 2, "Instinctive Aim": 2, "Patience": 2,
      "Shattering Shot": 3, "Extreme Maneuvers": 5, "Heightened Perception": 5,
      "Foresight": 6, "Sense": 10, "Precognitive Reflex": 15, "Supernatural Reflex": 24
    },
    "Talent Upgrade": {
      "Blackwards Tailslide": 1, "Composure": 1, "Deadeye Shot": 1, "Hopeful": 1, "Marg Sable Closure": 1,
      "Marksmanship": 2, "Debris Gambit": 3, "Lone Wolf": 3, "Predator": 3, "Daredevil": 4, "Elusive": 4,
      "Enduring": 4, "Selfess": 4, "Squad Leader": 4, "Trick a shot": 4, "Crack Shot": 5, "Intimidation": 7,
      "Juke": 7, "Snap shot": 7, "Swarm Tactics": 7, "Outmaneuver": 9
    },
    "Torpedo Upgrade": {
      "Homing Torpedoes": 4, "Ion Torpedoes": 5, "Plasma Torpedoes": 7, "Adv Proton Torpedoes": 9, "Proton Torpedoes": 14
    },
    "Astromech Upgrade": {
      "Chopper": 2, "R4 Astromech": 2, "Watchful Astromech": 2, "R3 Astromech": 3, "R5 Astromech": 7, "R2 Astromech": 8, "R5-D8": 9, "R2 D2": 10
    },
    "Modification Upgrade": {
      "Angled Deflectors": 1, "Delayed Fuses": 1, "Munitions Failsafe": 1, "Targeting Computer": 1, "Electronic Baffle": 2, "Afterburners": 8,
      "Hull Upgrade": 9, "Shield Upgrade": 10, "Static Descharge Vanes": 12
    },
    "Configuration Upgrade": { "S-Foils": 0 },
    "Illicit Upgrade": {
      "Deadman's Switch": 2, "Contraband Cybernetics": 3, "Overtuned Modulators": 3, "Feedback Array": 4,
      "False Transponder Codes": 5, "Cloakind Device": 8, "Inertial Dampeners": 8
    },
    "Missile Upgrade": {
      "Ion Missiles": 3, "XX-23 S-Thread Tracers": 4, "Homing Missiles": 5, "Cluster Missiles": 6, "Proton Rocket": 6, "Concussion Missiles": 7,
      "Mag-Pulse Warheads": 7
    }
  };

  function addShip() {
    const squadronDiv = document.getElementById("squadron");
    const shipDiv    = document.createElement("div");
    shipDiv.className = "ship-section xwing";

    // wybór typu statku
    const shipSelect = document.createElement("select");
    shipSelect.className = "ship-select";
    shipSelect.innerHTML = `<option value="X-Wing">X-Wing</option>`;
    shipDiv.appendChild(shipSelect);

    // wybór pilota
    const pilotSelect = document.createElement("select");
    pilotSelect.className = "pilot-select";
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    pilotSelect.onchange = () => updateUpgrades(shipDiv);
    shipDiv.appendChild(pilotSelect);

    // miejsce na upgrade’y i punkty
    const upgradeDiv = document.createElement("div");
    upgradeDiv.className = "upgrade-section";
    shipDiv.appendChild(upgradeDiv);

    const ptsDiv = document.createElement("div");
    ptsDiv.className = "upgrade-points";
    shipDiv.appendChild(ptsDiv);

    squadronDiv.appendChild(shipDiv);
    updatePilotOptions(shipDiv, "X-Wing");

    // automatyczny wybór pierwszego pilota
    if (pilotSelect.options.length > 1) {
      pilotSelect.selectedIndex = 1;
      updateUpgrades(shipDiv);
    }

    // odświeżenie sumy punktów
    updateGlobalTotalPoints();
  }

  function updatePilotOptions(shipDiv, selectedShip) {
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    Object.entries(ships[selectedShip]).forEach(([pilot, data]) => {
      pilotSelect.innerHTML += `<option value='${pilot}'>${pilot} (${data.cost} pkt)</option>`;
    });
    updateUpgrades(shipDiv);
  }

  function updateUpgrades(shipDiv) {
    const pilotSel = shipDiv.querySelector(".pilot-select");
    const upSec    = shipDiv.querySelector(".upgrade-section");
    const ptsDiv   = shipDiv.querySelector(".upgrade-points");
    upSec.innerHTML = "";
    ptsDiv.innerHTML = "";
    if (!pilotSel.value) return;

    const data = ships["X-Wing"][pilotSel.value];

    // Specjalne presety:
    // (każdy preset tworzy zablokowany select i zlicza jego koszt)
    const presetsMap = {
      "Wedge Antilles Battle Over Endor": [
        ["Talent Upgrade",    "It's a Trap"],
        ["Torpedo Upgrade",   "Advanced Proton Torpedoes"],
        ["Astromech Upgrade", "R2 D3"],
        ["Talent Upgrade",    "Predator"]
      ],
      "Luke Skywalker Battle of Yavin": [
        ["Talent Upgrade",    "Attack Speed"],
        ["Force Upgrade",     "Instinctive Aim"],
        ["Torpedo Upgrade",   "Proton Torpedoes"],
        ["Astromech Upgrade", "R2-D2"]
      ],
      "Luke Skywalker Red Five": [
        ["Talent Upgrade",    "Instinctive Aim"],
        ["Torpedo Upgrade",   "Proton Torpedoes"],
        ["Astromech Upgrade", "R2-D2"]
      ],
      "Wedge Antilles Battle of Yavin": [
        ["Talent Upgrade",    "Attack Speed"],
        ["Talent Upgrade",    "Marksmanship"],
        ["Torpedo Upgrade",   "Proton Torpedoes"],
        ["Astromech Upgrade", "R2-A3"]
      ],
      "Yendor Battle of Endor": [
        ["Talent Upgrade",    "It's a Trap"],
        ["Torpedo Upgrade",   "Plasma Torpedoes"],
        ["Astromech Upgrade", "Stabilizing Astromech"]
      ],
      "Garven Dreis Battle of Yavin": [
        ["Torpedo Upgrade",   "Advanced Proton Torpedoes"],
        ["Astromech Upgrade", "R5-K6"]
      ],
      "Jek Porkins Battle of Yavin": [
        ["Torpedo Upgrade",      "Advanced Proton Torpedoes"],
        ["Astromech Upgrade",    "R5-D8"],
        ["Modification Upgrade", "Unstable Sublight Engines"]
      ],
      "Jek Porkins Red Six": [
        ["Talent Upgrade",      "Predator"],
        ["Torpedo Upgrade",     "Proton Torpedoes"],
        ["Astromech Upgrade",   "R5-D8"]
      ],
      "Endy Idele Battle of Endor": [
        ["Talent Upgrade",      "It's a Trap"],
        ["Torpedo Upgrade",     "Ion Missiles"],
        ["Astromech Upgrade",   "Modified R4-P Unit"],
        ["Modification Upgrade","Chaff Particles"]
      ],
      "Biggs Darklighter Battle of Yavin": [
        ["Talent Upgrade",      "Attack Speed"],
        ["Talent Upgrade",      "Selfless"],
        ["Torpedo Upgrade",     "Proton Torpedoes"],
        ["Astromech Upgrade",   "R2-F2"]
      ]
    };

    if (presetsMap[pilotSel.value]) {
      let total = 0;
      presetsMap[pilotSel.value].forEach(([cat, val]) => {
        const sel = document.createElement("select");
        sel.className = "upgrade-select";
        sel.disabled = true;
        sel.dataset.category = cat;
        sel.innerHTML = `<option>${val}</option>`;
        total += upgrades[cat][val] || 0;
        upSec.appendChild(sel);
      });
      ptsDiv.innerText = `Użyte punkty: ${total}/${data.upgradeLimit}`;
      return;
    }

    // Domyślne sloty dla innych pilotów
    if (data.talentSlots)        for (let i = 1; i <= data.talentSlots;        i++) createUpgradeSelect(upSec, "Talent Upgrade",      upgrades["Talent Upgrade"],      `No Talent Upgrade (Slot ${i})`);
    if (data.astromechSlots)     for (let i = 1; i <= data.astromechSlots;     i++) createUpgradeSelect(upSec, "Astromech Upgrade",    upgrades["Astromech Upgrade"],    `No Astromech Upgrade (Slot ${i})`);
    if (data.torpedoSlots)       for (let i = 1; i <= data.torpedoSlots;       i++) createUpgradeSelect(upSec, "Torpedo Upgrade",      upgrades["Torpedo Upgrade"],      `No Torpedo Upgrade (Slot ${i})`);
    if (data.modificationSlots)  for (let i = 1; i <= data.modificationSlots;  i++) createUpgradeSelect(upSec, "Modification Upgrade",  upgrades["Modification Upgrade"],  `No Modification (Slot ${i})`);
    if (data.missileSlots)       for (let i = 1; i <= data.missileSlots;       i++) createUpgradeSelect(upSec, "Missile Upgrade",      upgrades["Missile Upgrade"],      `No Missile Upgrade (Slot ${i})`);
    if (data.force)              for (let i = 1; i <= data.force;              i++) createUpgradeSelect(upSec, "Force Upgrade",        upgrades["Force Upgrade"],        `No Force Upgrade (Slot ${i})`);
    if (data.configurationSlots) for (let i = 1; i <= data.configurationSlots; i++) createUpgradeSelect(upSec, "Configuration Upgrade",upgrades["Configuration Upgrade"],`No Configuration (Slot ${i})`);
    if (data.illicitUpgrades || data.illicitUpgrades === 1) for (let i = 1; i <= (data.illicitUpgrades || 0); i++) createUpgradeSelect(upSec, "Illicit Upgrade", upgrades["Illicit Upgrade"], `No Illicit Upgrade (Slot ${i})`);

    updateUpgradePointsDisplay(shipDiv);
  }

  function createUpgradeSelect(container, category, optionsObj, defaultText) {
    const select = document.createElement("select");
    select.className = "upgrade-select";
    select.dataset.category = category;
    select.innerHTML = `<option value=''>${defaultText}</option>` +
      Object.entries(optionsObj)
            .map(([up, cost]) => `<option value='${up}'>${up} (${cost} pkt)</option>`)
            .join('');
    select.onchange = () => updateUpgradePointsDisplay(container.parentNode);
    container.appendChild(select);
  }

  function updateUpgradePointsDisplay(shipDiv) {
    const used = Array.from(shipDiv.querySelectorAll(".upgrade-select"))
      .reduce((sum, sel) => {
        const cat = sel.dataset.category;
        return sel.value && upgrades[cat]?.[sel.value]
          ? sum + upgrades[cat][sel.value]
          : sum;
      }, 0);
    const pilot = shipDiv.querySelector(".pilot-select").value;
    const limit = ships["X-Wing"][pilot].upgradeLimit;
    shipDiv.querySelector(".upgrade-points").innerText = `Użyte punkty: ${used} / ${limit}`;
    updateGlobalTotalPoints();
  }

  function calculateUpgradePoints(shipDiv) {
    return Array.from(shipDiv.querySelectorAll(".upgrade-select"))
      .reduce((sum, sel) => {
        const cat = sel.dataset.category;
        return sel.value && upgrades[cat]?.[sel.value]
          ? sum + upgrades[cat][sel.value]
          : sum;
      }, 0);
  }

  function getPilotPoints(shipDiv) {
    const pilot = shipDiv.querySelector(".pilot-select").value;
    return pilot ? ships["X-Wing"][pilot].cost : 0;
  }

  function updateGlobalTotalPoints() {
    const total = Array.from(document.querySelectorAll(".ship-section"))
      .reduce((sum, sec) => sum + getPilotPoints(sec) + calculateUpgradePoints(sec), 0);
    const globalDiv = document.getElementById("global-points");
    if (globalDiv) globalDiv.innerText = `Suma punktów: ${total}`;
  }

  window.xwingRules = {
    addShip,
    getPilotPoints,
    getUpgradePoints: calculateUpgradePoints
  };
  window.updateGlobalTotalPoints = updateGlobalTotalPoints;
})();
