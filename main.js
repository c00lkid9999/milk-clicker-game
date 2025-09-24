//vars
//game fundamentals
let milk = 0;
let milkPerClick = 1;
let milkPerSecond = 0;
let clicks = 0;
let growthRate = 1.1;

//HTML stuff
let unlockElements = [false, false, false];
let scene = "milk";

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
  }

  //functino to update all valid spans
  function updateSpans() {
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
}

//HTML button functions
  //Function to increase milk when button is clicked
  function incMilk() {
      milk += milkPerClick;
      clicks += 1;
  }

  //Function to switch to achievements menu
  function switchAchiev() {
    hideActiveDivs();
    document.getElementById("achievScene").style.display = "block";
    alert("Achievements menu is not yet implemented.");
  }

  //Function to switch to stats menu
  function switchStats() {
    hideActiveDivs();
    document.getElementById("statsScene").style.display = "block";
  }

  //Function to switch to settings menu
  function switchSettings() {
    hideActiveDivs();
    document.getElementById("settingsScene").style.display = "block";
  }

  //function to switch to milk scene
  function switchMilk() {
    hideActiveDivs();
    document.getElementById("milkScene").style.display = "block";
  }

  //Hide divs for a certain screen that must be hidden for other screens
  function hideActiveDivs() {
    document.getElementById(scene + "Scene").style.display = "none";
  }