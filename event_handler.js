
function init() {
    initGrid();
    initState();
    buildGrid();
    renderGrid();
    updateTurnDisplay();
    updateScoreDisplay();
    updateTimerDisplay();
    

    document.getElementById('grid').addEventListener('click', handleCellClick);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
}

function handleCellClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    if (isPaused || gameOver) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const movingPlayer = currentPlayer; // save before makeMove switches turn

    const moved = makeMove(row, col);

    if (!moved) {
        // Invalid move — flash the cell red
        flashInvalid(cell);
        playSound('invalid');
        return;
    }
    if (moveHistory.length === 0) {
        startTimers();
    }

    recordMove(movingPlayer, row, col);
    updateScores();
    renderGrid();
    updateScoreDisplay();
    playSound('place');
    startPlayerTimer();

    if (gameOver) {
        stopTimers();
        const winner = getWinner() || (scores[1] >= scores[2] ? 1 : 2);
        showWinner(winner);
        return;
    }

    updateTurnDisplay();
    startPlayerTimer();
    updateTimerDisplay();
}
function togglePause() {
    if (gameOver) return;

    if (isPaused) {
        resumeTimers();
        document.getElementById('pauseBtn').textContent = 'PAUSE';
        hideOverlay();
    } else {
        pauseTimers();
        document.getElementById('pauseBtn').textContent = 'RESUME';
        showPauseScreen();
    }
}

function restartGame() {
    stopTimers();
    initGrid();
    initState();
    buildGrid();
    renderGrid();
    updateTurnDisplay();
    updateScoreDisplay();
    updateTimerDisplay();
    hideOverlay();
    document.getElementById('pauseBtn').textContent = 'PAUSE';
    startTimers();
}

function onGameTimerEnd() {
    if (gameOver) return;
    gameOver = true;
    updateScores();
    const winner = scores[1] > scores[2] ? 1 : scores[2] > scores[1] ? 2 : currentPlayer;
    showWinner(winner);
}

function onPlayerTimerEnd() {
    if (gameOver) return;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnDisplay();
    startPlayerTimer();
    updateTimerDisplay();
}

function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case 'place':
                osc.type = 'sine';
                osc.frequency.value = 523;
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.15);
                break;

            case 'explode':
                osc.type = 'sawtooth';
                osc.frequency.value = 180;
                osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
                break;

            case 'invalid':
                osc.type = 'square';
                osc.frequency.value = 180;
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
                break;

            case 'win':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
                break;
        }
    } catch (e) {
        
    }
}


window.addEventListener('DOMContentLoaded', init);
