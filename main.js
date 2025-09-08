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

//html elements
let buildingButtons = [false];

function loop() {
    calcMPC();
    calcMPS();
    fixRounding();
    checkAchiev();
    checkRewards();
    document.getElementById("milkTotal").innerHTML = "Milk: " + milk;
    window.requestAnimationFrame(loop);
}

//start the game loop
window.onload = function() {
    setInterval(activateMPS, 1000); //starts giving milk per second
    window.requestAnimationFrame(loop);
}


//game fundamentals functions
function checkRewards() {
    console.log("a)")
    if (milk >= 10 && buildingButtons[0] == false) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = '<button onclick="addCow()">Buy a Cow</button>';
        const parentElement = document.getElementById("purchaseButtons");
        parentElement.appendChild(newDiv);
        const newDiv2 = document.createElement("div");
        newDiv2.innerHTML = '<button onclick="addFarmhand()">Buy a Farmhand</button>';
        parentElement.appendChild(newDiv2);
        buildingButtons[0] = true;
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
