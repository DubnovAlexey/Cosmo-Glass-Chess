/* ==========================================================================
   CHESS TIMER MODULE: Timer control
   ========================================================================== */

const timerWhiteEl = document.getElementById('timer-w');
const timerBlackEl = document.getElementById('timer-b');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

window.updateTimerVisualActiveState = function() {
    timerWhiteEl.classList.remove('active-turn');
    timerBlackEl.classList.remove('active-turn');

    if (!window.isGameActive) return;

    const turn = window.game.turn();
    if (turn === 'w') {
        timerWhiteEl.classList.add('active-turn');
    } else {
        timerBlackEl.classList.add('active-turn');
    }
};

window.startTimerCountdown = function() {
    clearInterval(window.timerInterval);
    window.timerInterval = setInterval(() => {
        if (!window.isGameActive) return;

        if (window.game.turn() === 'w') {
            window.whiteTime--;
            timerWhiteEl.textContent = formatTime(window.whiteTime);
            if (window.whiteTime <= 0) window.endGame('Black wins!');
        } else {
            window.blackTime--;
            timerBlackEl.textContent = formatTime(window.blackTime);
            if (window.blackTime <= 0) window.endGame('White wins!');
        }
    }, 1000);
};

window.endGame = function(message) {
    clearInterval(window.timerInterval);
    window.isGameActive = false;

    const btnStart = document.getElementById('btn-start');
    if (btnStart) btnStart.disabled = false;

    alert(message);
};