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

    // NEW: Getting Start and Restart buttons for the UI Manager
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');

    // NEW: UI STATE MANAGER
    // Central function to toggle button states based on game activity
    function toggleInterface(isPlay) {
        if (isPlay) {
            btnStart.disabled = true; // Disable Start
            btnOpenSettings.disabled = true; // Disable Settings
            btnPause.disabled = false; // Enable Pause
        } else {
            btnStart.disabled = false; // Enable Start
            btnOpenSettings.disabled = false; // Enable Settings
            btnPause.disabled = true; // Disable Pause
            btnPause.textContent = 'Pause'; // Reset Pause text
        }
    }

    // Initialize interface on load (game is not active)
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
    btnStart.addEventListener('click', () => {
        if (!window.isGameActive) {
            window.isGameActive = true;
            window.startTimerCountdown();

            // NEW: Update UI state to active
            toggleInterface(true);

            // KICKSTART AI: If player is Black, AI is White and must move first
            if (window.playerColor === 'b') {
                document.dispatchEvent(new CustomEvent('chessMoveCompleted'));
            }
        }
    });

    btnRestart.addEventListener('click', () => {
        window.game.reset();
        window.isGameActive = false;
        clearInterval(window.timerInterval);

        // NEW: Update UI state to inactive
        toggleInterface(false);

        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 10;
        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;
        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);

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