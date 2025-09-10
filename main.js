//vars

//buildings
let cows = 0;
let farmhands = 0;
let barns = 0;
let milkmaids = 0;
let cheesePoints = 0;

//building costs
let cowCost = 10;
let farmhandCost = 10;
let barnCost = 100;
let milkmaidCost = 100;
let cheeseCost = 500;

//game fundamentals
let milk = 0;
let milkPerClick = 1;
let milkPerSecond = 0;
let clicks = 0;
let growthRate = 1.1;

//junlockable html elements
let unlockElements = [false, false];

function loop() {
    calcMPC();
    calcMPS();
    fixRounding();
    checkAchiev();
    checkRewards();
    updateSpans();
    window.requestAnimationFrame(loop);
}

//start the game loop
window.onload = function() {
    setInterval(activateMPS, 1000); //starts giving milk per second
    window.requestAnimationFrame(loop);
}


//game fundamentals functions
function checkRewards() {
    if (milk >= 10 && unlockElements[0] == false) {
        //add "buy cow" button
        const buyCowDiv = document.createElement("div");
        buyCowDiv.setAttribute("class", "building-button");
        buyCowDiv.innerHTML = '<button onclick="addCow()">Buy a Cow</button><p>Cost: <span id="cowCost"></span>&emsp;Owned: <span id="cowsOwned"></span></p> <p style="font-size: 8px">0.1 MPC</p>';
        const parentElement = document.getElementById("purchaseButtons");
        parentElement.appendChild(buyCowDiv);
        //add "buy farmhand" button
        const buyFhandDiv = document.createElement("div");
        buyFhandDiv.setAttribute("class", "building-button");
        buyFhandDiv.innerHTML = '<button onclick="addFarmhand()">Buy a Farmhand</button><p>Cost: <span id="farmhandCost"></span>&emsp;Owned: <span id="farmhandsOwned"></span></p> <p style="font-size: 8px">1 MPS</p>';
        parentElement.appendChild(buyFhandDiv);
        //add MPC/MPS display
        const cpxDiv = document.createElement("div");
        cpxDiv.innerHTML = '<p style="font-size: 10px; text-align: center">MPC: <span id="MPC"></span>&emsp;MPS: <span id="MPS"></span></p>';
        const parentElement2 = document.getElementById("milkBanner");
        parentElement2.appendChild(cpxDiv);
        unlockElements[0] = true;
    }
    if (milk >= 100 && unlockElements[1] == false) {
        //add "buy barn" button
        const buyBarnDiv = document.createElement("div");
        buyBarnDiv.setAttribute("class", "building-button");
        buyBarnDiv.innerHTML = '<button onclick="addBarn()">Buy a Barn</button><p>Cost: <span id="barnCost"></span>&emsp;Owned: <span id="barnsOwned"></span></p> <p style="font-size: 8px">1 MPC</p>';
        const parentElement = document.getElementById("purchaseButtons");
        parentElement.appendChild(buyBarnDiv);
        //add "buy milkmaid" button
        const buyMmaidDiv = document.createElement("div");
        buyMmaidDiv.setAttribute("class", "building-button");
        buyMmaidDiv.innerHTML = '<button onclick="addMilkmaid()">Buy a Milkmaid</button><p>Cost: <span id="milkmaidCost"></span>&emsp;Owned: <span id="milkmaidsOwned"></span></p> <p style="font-size: 8px">10 MPS</p>';
        parentElement.appendChild(buyMmaidDiv);
        unlockElements[1] = true;
    }
}

function updateSpans() {
  document.getElementById("milkTotal").innerHTML = "Milk: " + milk;
  if (unlockElements[0] == true) {
    //update building cost/owned spans
    document.getElementById("cowCost").innerHTML = cowCost;
    document.getElementById("cowsOwned").innerHTML = cows;
    document.getElementById("farmhandCost").innerHTML = farmhandCost;
    document.getElementById("farmhandsOwned").innerHTML = farmhands;
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
}

function calcMPC() {
    milkPerClick = 1 + (0.1 * cows) + (1 * barns);
}

function calcMPS() {
    milkPerSecond = farmhands + (10 * milkmaids);
}

function fixRounding() {
    milk = Math.round(milk * 10)/10;
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
