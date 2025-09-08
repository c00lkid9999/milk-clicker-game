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

function loop() {
    calcMPC();
    calcMPS();
    fixRounding();
    checkAchiev();
    document.getElementById("milkTotal").innerHTML = "Milk:" + milk;
    window.requestAnimationFrame(loop);
}

//start the game loop
window.onload = function() {
    window.requestAnimationFrame(loop);
}