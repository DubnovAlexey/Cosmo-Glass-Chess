/* ==========================================================================
   MAIN CONTROLLER: Initialization, Event Listeners, and UI State
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZATION
    renderBoard();

    const formatTimeDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 2. DOM ELEMENTS
    const timerW = document.getElementById('timer-w');
    const timerB = document.getElementById('timer-b');
    const timeInput = document.getElementById('time-input');
    const colorSelect = document.getElementById('player-color-select');

    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('btn-open-settings-modal');
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    const btnConfirmSettings = document.getElementById('btn-confirm-settings');
    const btnPause = document.getElementById('btn-pause');

    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');

    // UI STATE MANAGER
    function toggleInterface(isPlay) {
        if (isPlay) {
            btnStart.disabled = true;
            btnOpenSettings.disabled = true;
            btnPause.disabled = false;
        } else {
            btnStart.disabled = false;
            btnOpenSettings.disabled = false;
            btnPause.disabled = true;
            btnPause.textContent = 'Pause';
        }
    }

    toggleInterface(false);

    // 3. SETTINGS MODAL LOGIC
    timeInput.addEventListener('focus', function() {
        this.select();
    });

    btnOpenSettings.addEventListener('click', () => {
        if (window.isGameActive) {
            alert('You cannot change settings while the match is active!');
            return;
        }
        settingsModal.showModal();
    });

    btnCancelSettings.addEventListener('click', () => {
        settingsModal.close();
    });

    btnConfirmSettings.addEventListener('click', () => {
        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 10;
        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;
        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);

        window.playerColor = colorSelect.value;
        window.isBoardFlipped = (window.playerColor === 'b');
        renderBoard();

        settingsModal.close();
    });

    // 4. GAME CONTROLS LOGIC
    btnStart.addEventListener('click', () => {
        if (!window.isGameActive) {
            window.isGameActive = true;
            window.startTimerCountdown();

            toggleInterface(true);

            if (window.playerColor === 'b') {
                document.dispatchEvent(new CustomEvent('chessMoveCompleted'));
            }
        }
    });

    btnRestart.addEventListener('click', () => {
        window.game.reset();
        window.isGameActive = false;
        clearInterval(window.timerInterval);

        toggleInterface(false);

        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 10;
        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;
        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);

        window.isBoardFlipped = (window.playerColor === 'b');
        renderBoard();
    });

    btnPause.addEventListener('click', () => {
        if (window.isGameActive) {
            window.isGameActive = false;
            btnPause.textContent = 'Resume';
        } else {
            window.isGameActive = true;
            window.startTimerCountdown();
            btnPause.textContent = 'Pause';

            if (window.game.turn() !== window.playerColor) {
                document.dispatchEvent(new CustomEvent('chessMoveCompleted'));
            }
        }
    });

    document.getElementById('btn-flip').addEventListener('click', () => {
        window.isBoardFlipped = !window.isBoardFlipped;
        renderBoard();
    });

    // NEW: Event listener to catch the end of the game and unlock the UI
    document.addEventListener('chessGameEnded', () => {
        toggleInterface(false);
    });
});