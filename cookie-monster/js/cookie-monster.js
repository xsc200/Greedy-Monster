const CELL_DIM = 100;
const WUMPUS_DIM = 100;

const DIRECTIONS = {
    UP: 0,
    RIGHT: 90,
    DOWN: 180,
    LEFT: 270
};

class Monster {
    constructor() {
        this.element = this.buildMonster();
        this.simulator = new Simulator();

        this.row = 0;
        this.col = 0;
        this.displayPosition(0, 0);
        this.rotation = 180;
        this.displayRotation(180);
    }

    buildMonster() {
        let monsterElement = document.createElement('div');
        monsterElement.setAttribute('class', 'cm-character');
        return monsterElement;
    }

    setPosition(row, col) {
        this.row = row;
        this.col = col;
        this.simulator.schedule(() => this.displayPosition(row, col));
    }

    displayPosition(row, col) {
        const offset = (CELL_DIM - WUMPUS_DIM) / 2;
        this.element.style.top = `${row * CELL_DIM + offset}px`;
        this.element.style.left = `${col * CELL_DIM + offset}px`;
    }

    getTransform(rotation) {
        return `rotate(${rotation}deg)`;
    }

    getOrientation() {
        // The first modulo brings us within -360,360
        // After adding 360, the second modulo will be non-negative
        return ((this.rotation % 360) + 360) % 360;
    }

    modifyRotation(diff) {
        this.rotation += diff;
        this.simulator.schedule(() => this.displayRotation(this.rotation));
    };

    displayRotation(rotation) {
        this.element.style.transform = this.getTransform(rotation);
    }
}

class Game {
    constructor(element, rows, cols, monsterRow, monsterCol) {
        this.world = element;
        this.world.style.position = 'relative';

        this.rows = rows;
        this.cols = cols;

        this.monster = new Monster();
        this.monster.setPosition(monsterRow, monsterCol);
        this.world.appendChild(this.monster.element);

        this.buildGrid();

        this.snacks = [];
        this.snackElements = [];
        this.initSnacks();
    }

    buildGrid() {
        let table = document.createElement('table');
        table.setAttribute('class', 'cm-grid');
        for (let row = 0; row < this.rows; row++) {
            let tableRow = document.createElement('tr');
            for (let col = 0; col < this.cols; col++) {
                let tableCell = document.createElement('td');
                tableRow.appendChild(tableCell);
            }
            table.appendChild(tableRow);
        }
        this.world.appendChild(table);
    }

    initSnacks() {
        for (let row = 0; row < this.rows; row++) {
            this.snacks[row] = [];
            this.snackElements[row] = [];
        }
    }

    addSnack(row, col) {
        let snackElement = document.createElement('div');
        snackElement.setAttribute('class', 'cm-snack');
        snackElement.style.top = `${row * CELL_DIM}px`;
        snackElement.style.left = `${col * CELL_DIM}px`;

        this.snacks[row][col] = true;
        this.snackElements[row][col] = snackElement;

        this.world.appendChild(snackElement);
    }

    removeSnack(row, col) {
        this.snacks[row][col] = false;
        this.monster.simulator.schedule(() => this.displaySnackRemoval(row, col));
    }

    displaySnackRemoval(row, col) {
        this.snackElements[row][col].remove();
    }

    checkForWin() {
        for (let row of this.snacks) {
            for (let col of row) {
                if (col) {
                    return false;
                }
            }
        }
        return true;
    }

    showWinBox() {
        
    }

    moveMonster(row, col) {
        this.monster.setPosition(row, col);
    }

    moveMonsterForward() {
        switch(this.monster.getOrientation()) {
            case DIRECTIONS.UP:
                this.moveMonster(this.monster.row - 1, this.monster.col);
                break;
            case DIRECTIONS.RIGHT:
                this.moveMonster(this.monster.row, this.monster.col + 1);
                break;
            case DIRECTIONS.DOWN:
                this.moveMonster(this.monster.row + 1, this.monster.col);
                break;
            case DIRECTIONS.LEFT:
                this.moveMonster(this.monster.row, this.monster.col - 1);
                break;
        }

        let cookieFound = false;

        if (this.snacks[this.monster.row][this.monster.col]) {
            cookieFound = true;
            this.removeSnack(this.monster.row, this.monster.col);
        }

        return {
            currentPosition: [this.monster.row, this.monster.col],
            cookieFound: cookieFound
        }
    }

    turnMonsterRight() {
        this.monster.modifyRotation(90);
    }

    turnMonsterLeft() {
        this.monster.modifyRotation(-90);
    }

    turnMonsterAround() {
        this.monster.modifyRotation(180);
    }

    distanceToCookie(row, col) {
        let rowDiff = Math.abs(row - this.monster.row);
        let colDiff = Math.abs(col - this.monster.col);
        return rowDiff + colDiff;
    }

    smellCookie() {
        let closest = null;
        let shortestDistance = Number.MAX_SAFE_INTEGER;
        for (let row = 0; row < this.snacks.length; row++) {
            for (let col = 0; col < this.snacks[row].length; col++) {
                if (this.snacks[row][col] === true) {
                    let distance = this.distanceToCookie(row, col);
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        closest = [
                            row - this.monster.row,
                            col - this.monster.col,
                        ]
                    }
                }
            }
        }
        return closest;
    }
}
