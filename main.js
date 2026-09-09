/*TODO List
 * Add alts to images
 * Add achievements
 * Finish cheese setup
 * Get rid of inline styling and add ids (I am a changed man)
 * Rewrite save structure to make it more compact????
 * Make background of cheese page cheese color
 * Make debug button more sophisticated
 * Add animations (aaaaahh scary maybe I won't do this)
 */

  /////////////////
 //  VARIABLES  //
/////////////////

//game fundamentals
let milk = 0;
let milkPerClick = 1;
let milkPerSecond = 0;
let growthRate = 1.15;
let cheese = 0;

//stats stuff
let totalMilk = 0;
let clicks = 0;

//scenes and progress
let unlockElements = [false, false, false, false];
let scene = "milk";

//alerts
var alerts = [];

  /////////////////
 //  BUILDINGS  //
/////////////////

//building constructor function
var building = function(name, article, baseCost, type, value) {
  this.name = name;
  this.article = article; //a or an (for making the button)
  this.baseCost = baseCost;
  this.cost = baseCost;
  this.owned = 0;
  this.type = type; //MPC or MPS
  this.value = value; //# of MPC or MPS boost
}

//building HTML add
building.prototype.addHTML = function() {
  const buyBuildingDiv = document.createElement("div");
  buyBuildingDiv.setAttribute("class", "building-button");
  buyBuildingDiv.innerHTML = '<button onclick="'+this.name+'Building.addBuilding()">Buy ' + this.article + ' '+capitalize(this.name)+'</button><p>Cost: <span id="'+this.name+'Cost"></span>&emsp;Owned: <span id="'+this.name+'sOwned"></span></p> <p style="font-size: 8px">'+this.value+' '+this.type+'</p>';
  const parentElement = document.getElementById("purchaseButtons");
  parentElement.appendChild(buyBuildingDiv);
}

//adds one of the building, called when button is pressed
building.prototype.addBuilding = function() {
  if (milk < this.cost) {
    alerts.push(new alert("Purchase failed", "Not enough milk!"));
  } else {
    this.owned += 1;
    milk -= this.cost;
    this.cost = Math.trunc(this.baseCost * growthRate ** this.owned);
  }
}

//update spans related to building
building.prototype.updateSpans = function() {
  document.getElementById(this.name+"Cost").innerHTML = this.cost;
  document.getElementById(this.name+"sOwned").innerHTML = this.owned;
}

//add buildings
var cowBuilding = new building("cow", "a", 10, "MPC", 0.1);
var farmhandBuilding = new building("farmhand", "a", 10, "MPS", 1);
var barnBuilding = new building("barn", "a", 100, "MPC", 1);
var milkmaidBuilding = new building("milkmaid", "a", 100, "MPS", 10);
var pastureBuilding = new building("pasture", "a", 1000, "MPC", 5);
var expertBuilding = new building("expert", "an", 1000, "MPS", 50);

  //////////////////
 //    ALERTS    //
//////////////////

var alert = function(header, message) {
  this.id = alerts.length;
  this.header = header;
  this.message = message;
  this.pushAlert();
}

alert.prototype.pushAlert = function() {
  const alertDiv = document.createElement("div");
  alertDiv.setAttribute("class", "alert");
  alertDiv.setAttribute("id", "alerts-" + this.id);
  alertDiv.innerHTML = '<button onClick="alerts[' + this.id + '].delete()">X</button><h3>'+this.header+'</h3><p>'+this.message+'</p>';
  const parentElement = document.getElementById("alertStack");
  parentElement.appendChild(alertDiv);
}

alert.prototype.delete = function() {
  const alertDiv = document.getElementById("alerts-" + this.id);
  alertDiv.remove();
}

//game loop
function loop() {
    main(); //call the main function
    window.requestAnimationFrame(loop);
}

//start the game loop
window.onload = function() {
    setInterval(activateMPS, 1000); //starts giving milk per second
    window.requestAnimationFrame(loop);
}

//main game function
function main() {
  calcMPC();
  calcMPS();
  fixRounding();
  checkAchiev();
  checkRewards();
  updateSpans();
}

//game loop functions
  //checks if new elements need to be unlocked
  function checkRewards() {
    if (milk >= 10 && unlockElements[0] == false) {
        //add "buy cow" button
        cowBuilding.addHTML();
        //add "buy farmhand" button
        farmhandBuilding.addHTML();
        //add MPC/MPS display
        const cpxDiv = document.createElement("div");
        cpxDiv.innerHTML = '<p style="font-size: 10px; text-align: center">MPC: <span id="MPC"></span>&emsp;MPS: <span id="MPS"></span></p>';
        const parentElement = document.getElementById("milkBanner");
        parentElement.appendChild(cpxDiv);
        unlockElements[0] = true;
    }
    if (milk >= 50 && unlockElements[1] == false) {
        //add "buy barn" button
        barnBuilding.addHTML();
        //add "buy milkmaid" button
        milkmaidBuilding.addHTML();
        unlockElements[1] = true;
    }
    if (milk >= 500 && unlockElements[2] == false) {
      //add "buy pasture" button
      pastureBuilding.addHTML();
      //add "buy milk expert" button
      expertBuilding.addHTML();
      unlockElements[2] = true;
    }
    if (milk >= 5000 && unlockElements[3] == false) {
      //add cheese tab
      const cheeseTab = document.createElement("button");
      cheeseTab.setAttribute("onclick", "switchCheese()");
      cheeseTab.setAttribute("class", "invisibleButton");
      cheeseTab.innerHTML = '<div class="small-button" style="background-color: rgb(255, 225, 58);"><img src="Resources/cheese.png" class="icon"></div>';
      const parentElement = document.getElementById("header-right");
      parentElement.appendChild(cheeseTab);
      unlockElements[3] = true;
    }
  }

  //functino to update all valid spans
  function updateSpans() {
    if (scene === 'milk') {
      document.getElementById("milkTotal").innerHTML = "Milk: " + milk;
      if (unlockElements[0] == true) {
        //update tier 1 cost/owned spans
        cowBuilding.updateSpans();
        farmhandBuilding.updateSpans();
        //update cps and cpc spans
        document.getElementById("MPC").innerHTML = milkPerClick;
        document.getElementById("MPS").innerHTML = milkPerSecond;
      }
      if (unlockElements[1] == true) {
        //update tier 2 cost/owned spans
        barnBuilding.updateSpans();
        milkmaidBuilding.updateSpans();
      }
      if (unlockElements[2] == true) {
        //update tier 3 cost/owned spans
        pastureBuilding.updateSpans();
        expertBuilding.updateSpans();
      }
    }
    if (scene === 'stats') {
      document.getElementById("totalClicks").innerHTML = "Total Clicks: " + clicks;
      document.getElementById("totalMilk").innerHTML = "Total Milk: " + totalMilk;
      document.getElementById("totalBuildings").innerHTML = "Total Buildings Owned: " + (cowBuilding.owned + farmhandBuilding.owned + barnBuilding.owned + milkmaidBuilding.owned + pastureBuilding.owned + expertBuilding.owned);
    }
  }

  //calculate the current MPC and apply it
  function calcMPC() {
    milkPerClick = 1 + (0.1 * cowBuilding.owned) + (1 * barnBuilding.owned) + (5 * pastureBuilding.owned);
  }

  //calculate the current MPS and apply it
  function calcMPS() {
      milkPerSecond = farmhandBuilding.owned + (10 * milkmaidBuilding.owned) + (50 * expertBuilding.owned);
  }

  //fix floating-point rounding errors
  function fixRounding() {
      milk = Math.round(milk * 10)/10;
      totalMilk = Math.round(totalMilk * 10)/10;
      milkPerClick = Math.round(milkPerClick * 10)/10;
      milkPerSecond = Math.round(milkPerSecond);
  }

  //placeholder function, will eventually check if achievements have been earned
  function checkAchiev() {
      //placeholder
  }

//helper function to capitalize first letter of string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//Function to increase milk per second, called every second
function activateMPS() {
    milk += milkPerSecond;
    totalMilk += milkPerSecond;
}

//HTML button functions
  //Function to increase milk when button is clicked
  function incMilk() {
      milk += milkPerClick;
      totalMilk += milkPerClick;
      clicks += 1;
  }

  //Function to switch to achievements menu
  function switchAchiev() {
    hideActiveDivs();
    document.getElementById("achievScene").style.display = "block";
    scene = "achiev";
  }

  //Function to switch to stats menu
  function switchStats() {
    hideActiveDivs();
    document.getElementById("statsScene").style.display = "block";
    scene = "stats";
  }

  //Function to switch to settings menu
  function switchSettings() {
    hideActiveDivs();
    document.getElementById("settingsScene").style.display = "block";
    scene = "settings";
  }

  //function to switch to milk scene
  function switchMilk() {
    hideActiveDivs();
    document.getElementById("milkScene").style.display = "block";
    scene = "milk";
  }

  function switchCheese() {
    hideActiveDivs();
    document.getElementById("cheeseScene").style.display = "block";
    scene = "cheese"
  }

  //Hide divs for a certain screen that must be hidden for other screens
  function hideActiveDivs() {
    document.getElementById(scene + "Scene").style.display = "none";
  }

//Settings Button Functions
  function exportGame() {
    exportData = [milk, totalMilk, clicks, 
                  cowBuilding.owned, cowBuilding.cost, 
                  farmhandBuilding.owned, farmhandBuilding.cost, 
                  barnBuilding.owned, barnBuilding.cost, 
                  milkmaidBuilding.owned, milkmaidBuilding.cost,
                  pastureBuilding.owned, pastureBuilding.cost,
                  expertBuilding.owned, expertBuilding.cost];
    exportString = btoa(JSON.stringify(exportData));
    navigator.clipboard.writeText(exportString);
    alerts.push(new alert("Save Success", "Game data copied to clipboard!"));
  }
  function importGame() {
    let importString = prompt("Paste your save data here:");
    if (importString != null) {
      try {
        importData = JSON.parse(atob(importString));
        milk = importData[0];
        totalMilk = importData[1];
        clicks = importData[2];
        cowBuilding.owned = importData[3];
        cowBuilding.cost = importData[4];
        farmhandBuilding.owned = importData[5];
        farmhandBuilding.cost = importData[6];
        barnBuilding.owned = importData[7];
        barnBuilding.cost = importData[8];
        milkmaidBuilding.owned = importData[9];
        milkmaidBuilding.cost = importData[10];
        pastureBuilding.owned = importData[11];
        pastureBuilding.cost = importData[12];
        expertBuilding.owned = importData[13];
        expertBuilding.cost = importData[14];
      } catch (error) {
        alerts.push(new alert("Import Error", "Please make sure you pasted your save data correctly."));
      }
    }
  }
  function debug() {
    //ik that anyone can do this, it doesn't need to be secure
    if (navigator.userAgent == "c00lkid9999") {
      milk = 10000000000;
    }
  }