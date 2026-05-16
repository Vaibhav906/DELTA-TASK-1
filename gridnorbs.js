
function buildGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${COLS}, 50px)`;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            grid.appendChild(cell);
        }
    }
}

function renderGrid() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            renderCell(r, c);
        }
    }
}
function renderCell(r, c) {
    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    if (!cell) return;

    const data = gameGrid[r][c];

    cell.innerHTML = '';
    cell.className = 'cell';

    if (data.owner === 1) cell.classList.add('p1-cell');
    else if (data.owner === 2) cell.classList.add('p2-cell');

    for (let i = 0; i < data.orbs; i++) {
        const orb = document.createElement('div');
        orb.classList.add('orb', data.owner === 1 ? 'blue' : 'red');
        cell.appendChild(orb);
    }
}

function flashInvalid(cell) {
    cell.classList.add('invalid');
    setTimeout(() => cell.classList.remove('invalid'), 300);
}

function flashExplode(r, c) {
    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    if (!cell) return;
    cell.classList.add('exploding');
    setTimeout(() => cell.classList.remove('exploding'), 250);
}

function updateScoreDisplay() {
    document.getElementById('blueScore').textContent = scores[1];
    document.getElementById('redScore').textContent = scores[2];
}

function updateTimerDisplay() {
    document.getElementById('gameTimer').textContent = formatTime(gameTimerSeconds);
    document.getElementById('playerTimer').textContent = formatTime(currentPlayerTimer);
}

function updateTurnDisplay() {
    const el = document.getElementById('turnInfo');
    if (currentPlayer === 1) {
        el.textContent = "BLUE's turn";
        el.style.color = '#4fc3f7';
    } else {
        el.textContent = "RED's turn";
        el.style.color = '#ef5350';
    }
}

function showWinner(winner) {
    const overlay = document.getElementById('overlay');
    const text = document.getElementById('overlayText');
    const btn = document.getElementById('overlayBtn');

    text.textContent = (winner === 1 ? 'BLUE' : 'RED') + ' WINS!';
    text.style.color = winner === 1 ? '#4fc3f7' : '#ef5350';
    btn.textContent = 'PLAY AGAIN';
    btn.onclick = restartGame;
    overlay.style.display = 'flex';
}

function showPauseScreen() {
    const overlay = document.getElementById('overlay');
    const text = document.getElementById('overlayText');
    const btn = document.getElementById('overlayBtn');

    text.textContent = 'PAUSED';
    text.style.color = 'white';
    btn.textContent = 'RESUME';
    btn.onclick = togglePause;
    overlay.style.display = 'flex';
}

function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
}
