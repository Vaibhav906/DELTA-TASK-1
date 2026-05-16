
const ROWS = 12;
const COLS = 6;

let gameGrid = [];
let currentPlayer = 1;
let hasMoved = { 1: false, 2: false };
let gameOver = false;

function initGrid() {
    gameGrid = Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => ({
            orbs: 0,
            owner: null,
            capacity: getCapacity(r, c)
        }))
    );
    currentPlayer = 1;
    hasMoved = { 1: false, 2: false };
    gameOver = false;
}

function getCapacity(r, c) {
    const isTopBottom = r === 0 || r === ROWS - 1;
    const isLeftRight = c === 0 || c === COLS - 1;
    if (isTopBottom && isLeftRight) return 2;
    if (isTopBottom || isLeftRight) return 3;
    return 4;
}

function isValidMove(row, col) {
    if (gameOver) return false;
    const cell = gameGrid[row][col];

    if (!hasMoved[currentPlayer]) {
        return cell.owner === null;
    }

    return cell.owner === currentPlayer;
}

function makeMove(row, col) {
    if (!isValidMove(row, col)) return false;

    const cell = gameGrid[row][col];

    if (!hasMoved[currentPlayer]) {
        cell.orbs = cell.capacity - 1;
        cell.owner = currentPlayer;
        hasMoved[currentPlayer] = true;
    } else {
        cell.orbs += 1;
        cell.owner = currentPlayer;
    }

    processExplosions();

    if (getWinner()) {
        gameOver = true;
        return true;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    return true;
}

function processExplosions() {
    let changed = true;
    let safety = 0; 

    while (changed && safety < 500) {
        changed = false;
        safety++;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (gameGrid[r][c].orbs >= gameGrid[r][c].capacity) {
                    explodeCell(r, c);
                    changed = true;
                }
            }
        }
    }
}


function explodeCell(r, c) {
    gameGrid[r][c].orbs = 0;
    gameGrid[r][c].owner = null;

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            gameGrid[nr][nc].orbs += 1;
            gameGrid[nr][nc].owner = currentPlayer; 
        }
    }
}

function getWinner() {
    if (!hasMoved[1] || !hasMoved[2]) return null;

    let p1Cells = 0, p2Cells = 0;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (gameGrid[r][c].owner === 1) p1Cells++;
            if (gameGrid[r][c].owner === 2) p2Cells++;
        }
    }

    if (p1Cells === 0) return 2;
    if (p2Cells === 0) return 1;
    return null;
}
