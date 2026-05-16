let scores = { 1: 0, 2: 0 };
let gameTimerSeconds = 180;     
let playerTimerSeconds = 15;    
let currentPlayerTimer = 15;
let gameTimerInterval = null;
let playerTimerInterval = null;
let isPaused = false;
let moveHistory = [];

function initState() {
    scores = { 1: 0, 2: 0 };
    gameTimerSeconds = 180;
    currentPlayerTimer = playerTimerSeconds;
    isPaused = false;
    moveHistory = [];
}

function updateScores() {
    scores[1] = 0;
    scores[2] = 0;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (gameGrid[r][c].owner === 1) scores[1]++;
            if (gameGrid[r][c].owner === 2) scores[2]++;
        }
    }
}

function startTimers() {
    clearInterval(gameTimerInterval);
    clearInterval(playerTimerInterval);

    gameTimerInterval = setInterval(() => {
        if (isPaused) return;
        gameTimerSeconds--;
        updateTimerDisplay();

        if (gameTimerSeconds <= 0) {
            clearInterval(gameTimerInterval);
            clearInterval(playerTimerInterval);
            onGameTimerEnd();
        }
    }, 1000);

    
}

function startPlayerTimer() {
    currentPlayerTimer = playerTimerSeconds;
    clearInterval(playerTimerInterval);

    playerTimerInterval = setInterval(() => {
        if (isPaused) return;
        currentPlayerTimer--;
        updateTimerDisplay();

        if (currentPlayerTimer <= 0) {
            clearInterval(playerTimerInterval);
            onPlayerTimerEnd();
        }
    }, 1000);
}

function pauseTimers() {
    isPaused = true;
}

function resumeTimers() {
    isPaused = false;
}

function stopTimers() {
    clearInterval(gameTimerInterval);
    clearInterval(playerTimerInterval);
}

function formatTime(secs) {
    const s = Math.max(0, secs);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
}

function recordMove(player, row, col) {
    moveHistory.push({ player, row, col, time: gameTimerSeconds });
}
