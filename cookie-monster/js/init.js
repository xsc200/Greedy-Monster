let element = document.getElementById("world");
let game = new Game(element, boardSize, boardSize, 0, 0);
game.addSnack(2, 0);
game.addSnack(3, 3);
game.addSnack(2, 3);
game.addSnack(0, 1);

function forward() {
    return game.moveMonsterForward();
}

function right() {
    return game.turnMonsterRight();
}

function left() {
    return game.turnMonsterLeft();
}

function smellCookie() {
    return game.smellCookie();
}

function aboutFace() {
    return game.turnMonsterAround();
}