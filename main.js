//vars

//buildings
let cows = 0;
let farmhands = 0;
let barns = 0;
let milkmaids = 0;
let pastures = 0;
let experts = 0;
let cheesePoints = 0;

//building costs
let cowCost = 10;
let farmhandCost = 10;
let barnCost = 100;
let milkmaidCost = 100;
let pastureCost = 1000;
let expertCost = 1000;
let cheeseCost = 500;

//game fundamentals
let milk = 0;
let milkPerClick = 1;
let milkPerSecond = 0;
let clicks = 0;
let growthRate = 1.1;

//junlockable html elements
let unlockElements = [false, false, false];

//building constructor function
var building = function(name, baseCost, type, value) {
  this.name = name;
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
  buyBuildingDiv.innerHTML = '<button onclick="'+this.name+'Building.addBuilding()">Buy a '+capitalize(this.name)+'</button><p>Cost: <span id="'+this.name+'Cost"></span>&emsp;Owned: <span id="'+this.name+'sOwned"></span></p> <p style="font-size: 8px">'+this.value+' '+this.type+'</p>';
  console.log('<button onclick="'+this.onclickFunction+'()">Buy a '+capitalize(this.name)+'</button><p>Cost: <span id="'+this.name+'Cost"></span>&emsp;Owned: <span id="'+this.name+'sOwned"></span></p> <p style="font-size: 8px">'+this.value+' '+this.type+'</p>');
  const parentElement = document.getElementById("purchaseButtons");
  parentElement.appendChild(buyBuildingDiv);
}

//adds one of the building, called when button is pressed
building.prototype.addBuilding = function() {
  if (milk < this.cost) {
    alert("Not enough milk!");
  } else {
    this.owned += 1;
    milk -= this.cost;
    this.cost = Math.trunc(this.cost * growthRate ** this.owned);
  }
}

//update spans related to building
building.prototype.updateSpans = function() {
  document.getElementById(this.name+"Cost").innerHTML = this.cost;
  document.getElementById(this.name+"sOwned").innerHTML = this.owned;
}

//add buildings
var cowBuilding = new building("cow", 10, "MPC", 0.1);
var farmhandBuilding = new building("farmhand", 10, "MPS", 1);
var barnBuilding = new building("barn", 100, "MPC", 1);
var milkmaidBuilding = new building("milkmaid", 100, "MPS", 10);
var pastureBuilding = new building("pasture", 1000, "MPC", 5);
var expertBuilding = new building("expert", 1000, "MPS", 50);

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

//game fundamentals functions
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
}

//function to capitalize first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateSpans() {
  document.getElementById("milkTotal").innerHTML = "Milk: " + milk;
  if (unlockElements[0] == true) {
    //update building cost/owned spans
    cowBuilding.updateSpans();
    farmhandBuilding.updateSpans();
    //update cps and cpc spans
    document.getElementById("MPC").innerHTML = milkPerClick;
    document.getElementById("MPS").innerHTML = milkPerSecond;
  }
  if (unlockElements[1] == true) {
    //update building cost/owned spans
    document.getElementById("barnCost").innerHTML = barnCost;
    document.getElementById("barnsOwned").innerHTML = barns;
    document.getElementById("milkmaidCost").innerHTML = milkmaidCost;
    document.getElementById("milkmaidsOwned").innerHTML = milkmaids;
  }
  if (unlockElements[2] == true) {
    //update building cost/owned spans
    document.getElementById("pastureCost").innerHTML = pastureCost;
    document.getElementById("pasturesOwned").innerHTML = pastures;
    document.getElementById("expertCost").innerHTML = expertCost;
    document.getElementById("expertsOwned").innerHTML = experts;
  }
}

function calcMPC() {
    milkPerClick = 1 + (0.1 * cowBuilding.owned) + (1 * barnBuilding.owned) + (5 * pastureBuilding.owned);
}

function calcMPS() {
    milkPerSecond = farmhandBuilding.owned + (10 * milkmaidBuilding.owned) + (50 * expertBuilding.owned);
}

function fixRounding() {
    milk = Math.round(milk * 10)/10;
    milkPerClick = Math.round(milkPerClick * 10)/10;
    milkPerSecond = Math.round(milkPerSecond);
}

function checkAchiev() {
    //placeholder
}

function activateMPS() {
    milk += milkPerSecond;
}

//Button functions
function incMilk() {
    milk += milkPerClick;
    clicks += 1;
}

function addCow() {
    if (milk < cowCost) {
      console.log("Not enough milk!");
      //FIXME add notifications
    } else {
      cows += 1;
      milk -= cowCost;
      cowCost = Math.trunc(cowCost * growthRate ** cows);
    }
}

function addFarmhand() {
    if (milk < farmhandCost) {
      console.log("Not enough milk!");
    } else {
      farmhands += 1;
      milk -= farmhandCost;
      farmhandCost = Math.trunc(farmhandCost * growthRate ** farmhands);
    }
}

function addBarn() {
    if (milk < barnCost) {
      console.log("Not enough milk!");
      //FIXME add notifications
    } else {
      barns += 1;
      milk -= barnCost;
      barnCost = Math.trunc(barnCost * growthRate ** barns);
    }
}

function addMilkmaid() {
    if (milk < milkmaidCost) {
      console.log("Not enough milk!");
    } else {
      milkmaids += 1;
      milk -= milkmaidCost;
      milkmaidCost = Math.trunc(milkmaidCost * growthRate ** milkmaids);
    }
}

function addPasture() {
  if (milk < pastureCost) {
    console.log("Not enough milk!");
    //FIXME add notifications
  } else {
    pastures += 1;
    milk -= pastureCost;
    pastureCost = Math.trunc(pastureCost * growthRate ** pastures);
  }
}

function addExpert() {
  if (milk < expertCost) {
    console.log("Not enough milk!");
  } else {
    experts += 1;
    milk -= expertCost;
    expertCost = Math.trunc(expertCost * growthRate ** experts);
  }
}
