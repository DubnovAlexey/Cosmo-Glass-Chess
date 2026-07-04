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
        // Apply Time
        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 10;
        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;
        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);

        // Apply Color and flip board automatically if Black is chosen
        window.playerColor = colorSelect.value;
        window.isBoardFlipped = (window.playerColor === 'b');
        renderBoard();

        settingsModal.close();
    });

    // 4. GAME CONTROLS LOGIC
    document.getElementById('btn-start').addEventListener('click', () => {
        if (!window.isGameActive) {
            window.isGameActive = true;
            window.startTimerCountdown();
            btnPause.textContent = 'Pause';

            // KICKSTART AI: If player is Black, AI is White and must move first
            if (window.playerColor === 'b') {
                document.dispatchEvent(new CustomEvent('chessMoveCompleted'));
            }
        }
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        window.game.reset();
        window.isGameActive = false;
        clearInterval(window.timerInterval);

        document.getElementById('btn-start').disabled = false;

        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 10;
        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;
        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);
        btnPause.textContent = 'Pause';

        // Ensure board orientation matches chosen color on restart
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

            // Re-trigger AI just in case it was paused during its turn
            if (window.game.turn() !== window.playerColor) {
                document.dispatchEvent(new CustomEvent('chessMoveCompleted'));
            }
        }
    });

    document.getElementById('btn-flip').addEventListener('click', () => {
        window.isBoardFlipped = !window.isBoardFlipped;
        renderBoard();
    });
});