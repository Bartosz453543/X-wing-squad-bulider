(function(){
  const ships = {
    "A-wing": {
      "Hera Syndulla": {cost:3,upgradeLimit:8,force:0,talentSlots:2},
      "Ahsoka Tano": {cost:4,upgradeLimit:10,force:2,forceSlots:2,modificationSlots:2,missileSlots:1,configurationSlots:1},
      "Tycho Celchu": {cost:3,upgradeLimit:8,force:0},
      "Tycho Celchu Battle Over Endor": {cost:3,upgradeLimit:8,force:0},
      "Jake Farrel": {cost:2,upgradeLimit:6,force:0},
      "Jake Farrel Sage Instructor": {cost:2,upgradeLimit:6,force:0},
      "Shara Bey": {cost:3,upgradeLimit:8,force:0},
      "Shara Bey Green Four": {cost:3,upgradeLimit:8,force:0},
      "Arvel Crynyd": {cost:3,upgradeLimit:8,force:0},
      "Arvel Crynyd Green Leader": {cost:3,upgradeLimit:8,force:0},
      "Arvel Crynyd Battle Over Endor": {cost:3,upgradeLimit:8,force:0},
      "Wedge Antilles": {cost:6,upgradeLimit:20,force:0,talentSlots:2},
      "Green Squadron Pilot": {cost:2,upgradeLimit:6,force:0},
      "Keo Venzee": {cost:3,upgradeLimit:8,force:0},
      "Derek Klivian": {cost:3,upgradeLimit:6,force:0},
      "Sabine Wren": {cost:3,upgradeLimit:8,force:0},
      "Phoenix Squadron Pilot": {cost:2,upgradeLimit:6,force:0},
      "Germmer Sojan Battle Over Endor": {cost:3,upgradeLimit:8,force:0}
    }
  };

  const aWingExtras = {
    "Talent Upgrade":
    {
      "Composure": 1, "Deadeye Shot": 1, "Hopeful": 1, "Marg Sable Closure": 1, "Starbird Slash" : 1,
      "Marksmanship": 2, "Debris Gambit": 3, "Lone Wolf": 3, "Predator": 3,"Daredevil" : 4, "Elusive": 4,
      "Enduring": 4, "Selfess": 4, "Squad Leader": 4, "Trick a shot": 4, "Crack Shot": 5, "Intimidation": 7,
      "Juke": 7, "Snap shot": 7, "Swarm Tactics": 7, "Outmaneuver": 9
    },
    "Missile Upgrade":
    {
      "Ion Missiles":3, "XX-23 S-Thread Tracers":4, "Homing Missiles":5, "Cluster Missiles" : 6, "Proton Rocket" : 6, "Concussion Missiles":7,
      "Mag-Pulse Warheads":7
    },
    "Sensors":
    {
      "Fire-Control System": 2, "Passive Sensors": 5, "Collision Detector": 7, "Advanced Sensors": 8, "Trajectory Simulator": 10
    },
    "Modification Upgrade":{"Shield Upgrade":5,"Stealth Device":4,"Chaff Particles":2,"Afterburners":4},
    "Configuration":{"Chassis Mod":3,"Refit":2},
    "Cannon Upgrade":{"Rapid Fire":3,"Heavy Cannon":5}
  };

  const forceExtras = {"Sense":5,"Supernatural Reflexes":10,"Brilliant Evasion":6};

  function addShip(){
    const squadron = document.getElementById("squadron");
    const shipDiv = document.createElement("div");
    shipDiv.className = "ship-section awing";

    // Select statku
    const shipSelect = document.createElement("select");
    shipSelect.className = "ship-select";
    shipSelect.innerHTML = `<option value="A-wing">A-wing</option>`;
    shipDiv.appendChild(shipSelect);

    // Select pilota
    const pilotSelect = document.createElement("select");
    pilotSelect.className = "pilot-select";
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    pilotSelect.onchange = () => updateUpgrades(shipDiv);
    shipDiv.appendChild(pilotSelect);

    // Sekcja na upgrade’y
    const upgradeSection = document.createElement("div");
    upgradeSection.className = "upgrade-section";
    shipDiv.appendChild(upgradeSection);

    // Wyświetlanie punktów
    const pointsDiv = document.createElement("div");
    pointsDiv.className = "upgrade-points";
    shipDiv.appendChild(pointsDiv);

    // Przycisk usuwania
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.innerText = "Usuń statek";
    removeBtn.className = "remove-ship-button";
    removeBtn.onclick = () => removeShip(removeBtn);
    shipDiv.appendChild(removeBtn);

    squadron.appendChild(shipDiv);

    updatePilotOptions(shipDiv);

    // Automatyczny wybór pierwszego pilota i aktualizacja
    if (pilotSelect.options.length > 1) {
      pilotSelect.selectedIndex = 1;
      updateUpgrades(shipDiv);
    }
    if (typeof updateGlobalTotalPoints === "function") {
      updateGlobalTotalPoints();
    }
  }

  function removeShip(button){
    const shipDiv = button.closest(".ship-section");
    if (!shipDiv) return;
    shipDiv.remove();
    if (typeof updateGlobalTotalPoints === "function") {
      updateGlobalTotalPoints();
    }
  }

  function updatePilotOptions(shipDiv){
    const pilotSelect = shipDiv.querySelector(".pilot-select");
    pilotSelect.innerHTML = `<option value=''>Select Pilot</option>`;
    for(const p in ships["A-wing"]){
      const d = ships["A-wing"][p];
      pilotSelect.innerHTML += `<option value='${p}'>${p} (${d.cost} pkt)</option>`;
    }
    updateUpgrades(shipDiv);
  }

  function updateUpgrades(shipDiv){
    const pilot = shipDiv.querySelector(".pilot-select").value;
    const upSec  = shipDiv.querySelector(".upgrade-section");
    const ptsDiv = shipDiv.querySelector(".upgrade-points");
    upSec.innerHTML = "";
    ptsDiv.innerHTML = "";
    if(!pilot) return;
    const data = ships["A-wing"][pilot];

    // Specjalne presety pilota
    if(pilot === "Ahsoka Tano"){
      [...Array(2)].forEach((_,i)=>
        createUpgradeSelect(upSec,"Force Upgrade",forceExtras,`No Force Upgrade (Slot ${i+1})`)
      );
      [...Array(2)].forEach((_,i)=>
        createUpgradeSelect(upSec,"Modification Upgrade",aWingExtras["Modification Upgrade"],`No Modification Upgrade (Slot ${i+1})`)
      );
      createUpgradeSelect(upSec,"Missile Upgrade",aWingExtras["Missile Upgrade"],"No Missile Upgrade");
      createUpgradeSelect(upSec,"Configuration",aWingExtras["Configuration"],"No Configuration");
    }
    else if(pilot === "Hera Syndulla"){
      [...Array(2)].forEach((_,i)=>
        createUpgradeSelect(upSec,"Talent Upgrade",aWingExtras["Talent Upgrade"],`No Talent Upgrade (Slot ${i+1})`)
      );
      for(const cat in aWingExtras)
        if(cat!=="Talent Upgrade"&&cat!=="Cannon Upgrade")
          createUpgradeSelect(upSec,cat,aWingExtras[cat],`No ${cat}`);
    }
    else if(pilot === "Tycho Celchu Battle Over Endor"){
      applyPreset(upSec, ptsDiv, data, [
        ["Talent Upgrade","It's a Trap"],
        ["Talent Upgrade","Juke"],
        ["Missile Upgrade","Proton Rockets"],
        ["Modification Upgrade","Chaff Particles"]
      ]);
      return;
    }
    else if(pilot === "Tycho Celchu"){
      [...Array(2)].forEach((_,i)=>
        createUpgradeSelect(upSec,"Talent Upgrade",aWingExtras["Talent Upgrade"],`No Talent Upgrade (Slot ${i+1})`)
      );
      createUpgradeSelect(upSec,"Missile Upgrade",aWingExtras["Missile Upgrade"],"No Missile Upgrade");
      createUpgradeSelect(upSec,"Cannon Upgrade",aWingExtras["Cannon Upgrade"],"No Cannon Upgrade");
      createUpgradeSelect(upSec,"Configuration",aWingExtras["Configuration"],"No Configuration");
    }
    else if(pilot === "Jake Farrel Sage Instructor"){
      applyPreset(upSec, ptsDiv, data, [
        ["Talent Upgrade","Elusive"],
        ["Talent Upgrade","Outmaneuver"],
        ["Missile Upgrade","Ion Missiles"]
      ]);
      return;
    }
    else if(pilot === "Shara Bey Green Four"){
      applyPreset(upSec, ptsDiv, data, [
        ["Talent Upgrade","Hopeful"],
        ["Missile Upgrade","Concussion Missiles"]
      ]);
      return;
    }
    else if(pilot === "Arvel Crynyd Green Leader"){
      applyPreset(upSec, ptsDiv, data, [
        ["Talent Upgrade","Predator"],
        ["Modification Upgrade","Afterburners"]
      ]);
      return;
    }
    else if(pilot === "Arvel Crynyd Battle Over Endor"){
      applyPreset(upSec, ptsDiv, data, [
        ["Talent Upgrade","It's a Trap"],
        ["Talent Upgrade","Heroic Sacrifice"],
        ["Missile Upgrade","Proton Rockets"]
      ]);
      return;
    }
    else if(pilot === "Germmer Sojan Battle Over Endor"){
      applyPreset(upSec, ptsDiv, data, [
        ["Talent Upgrade","It's a Trap"],
        ["Cannon Upgrade","Heavy Cannon"],
        ["Modification Upgrade","Chaff Particles"],
        ["Modification Upgrade","Shield Upgrade"]
      ]);
      return;
    }
    else {
      for(const cat in aWingExtras)
        if(cat!=="Cannon Upgrade")
          createUpgradeSelect(upSec,cat,aWingExtras[cat],`No ${cat}`);
    }

    updateUpgradePointsDisplay(shipDiv);
  }

  function applyPreset(container, ptsDiv, data, presets){
    let total = 0;
    presets.forEach(([cat,val])=>{
      const sel = document.createElement("select");
      sel.className="upgrade-select"; sel.disabled=true; sel.dataset.category=cat;
      sel.innerHTML = `<option>${val}</option>`;
      const map = (cat==="Force Upgrade" ? forceExtras : aWingExtras[cat]);
      total += map[val] || 0;
      container.appendChild(sel);
    });
    ptsDiv.innerText = `Użyte punkty: ${total} / ${data.upgradeLimit}`;
  }

  function createUpgradeSelect(container,category,opts,defaultText){
    const sel = document.createElement("select");
    sel.className="upgrade-select"; sel.dataset.category=category;
    sel.innerHTML = `<option value=''>${defaultText}</option>` +
      Object.entries(opts).map(([u,c])=>`<option value='${u}'>${u} (${c} pkt)</option>`).join("");
    sel.onchange = () => updateUpgradePointsDisplay(container.closest('.awing'));
    container.appendChild(sel);
  }

  function updateUpgradePointsDisplay(div){
    const pts = div.querySelector(".upgrade-points");
    const used = calculateUpgradePoints(div);
    const lim = ships["A-wing"][div.querySelector(".pilot-select").value].upgradeLimit;
    pts.innerText = `Użyte punkty: ${used} / ${lim}`;
    if(typeof updateGlobalTotalPoints==="function") updateGlobalTotalPoints();
  }

  function calculateUpgradePoints(div){
    let sum = 0;
    div.querySelectorAll(".upgrade-select").forEach(sel=>{
      const map = (sel.dataset.category==="Force Upgrade"?forceExtras:aWingExtras[sel.dataset.category]);
      if(sel.value && map[sel.value]) sum += map[sel.value];
    });
    return sum;
  }

  function getPilotPoints(div){
    const p = div.querySelector(".pilot-select").value;
    return p ? ships["A-wing"][p].cost : 0;
  }

  window.awingRules = {
    addShip,
    calculateUpgradePoints,
    getPilotPoints,
    getUpgradePoints: calculateUpgradePoints
  };

  // funkcja globalna do sumy
  window.updateGlobalTotalPoints = function(){
    const total = Array.from(document.querySelectorAll(".ship-section"))
      .reduce((sum, sec) => sum + getPilotPoints(sec) + calculateUpgradePoints(sec), 0);
    const globalDiv = document.getElementById("global-points");
    if (globalDiv) globalDiv.innerText = `Suma punktów: ${total}`;
  };
})();
