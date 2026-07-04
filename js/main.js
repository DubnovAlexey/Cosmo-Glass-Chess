/* ==========================================================================
   MAIN CONTROLLER: Initialization, Event Listeners, and UI State
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZATION
    renderBoard();

    // Helper: Format seconds to MM:SS
    const formatTimeDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 2. DOM ELEMENTS
    const timerW = document.getElementById('timer-w');
    const timerB = document.getElementById('timer-b');
    const timeInput = document.getElementById('time-input');

    const timeModal = document.getElementById('time-modal');
    const btnOpenModal = document.getElementById('btn-open-time-modal');
    const btnCancelTime = document.getElementById('btn-cancel-time');
    const btnConfirmTime = document.getElementById('btn-confirm-time');
    const btnPause = document.getElementById('btn-pause');

    // 3. TIME MODAL LOGIC
    // Auto-select input text on focus for quick typing
    timeInput.addEventListener('focus', function() {
        this.select();
    });

    // Open modal
    btnOpenModal.addEventListener('click', () => {
        if (window.isGameActive) {
            alert('You cannot change the time while the match is active!');
            return;
        }
        timeModal.showModal();
    });

    // Close modal
    btnCancelTime.addEventListener('click', () => {
        timeModal.close();
    });

    // Apply time settings
    btnConfirmTime.addEventListener('click', () => {
        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 10;

        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;

        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);

        timeModal.close();
    });

    // 4. GAME CONTROLS LOGIC
    // Start match
    document.getElementById('btn-start').addEventListener('click', () => {
        if (!window.isGameActive) {
            window.isGameActive = true;
            window.startTimerCountdown();
            btnPause.textContent = 'Pause';
        }
    });

    // Restart match
    document.getElementById('btn-restart').addEventListener('click', () => {
        window.game.reset();
        window.isGameActive = false;
        clearInterval(window.timerInterval);

        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 10;

        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;

        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);
        btnPause.textContent = 'Pause';

        renderBoard();
    });

    // Pause / Resume toggle
    btnPause.addEventListener('click', () => {
        if (window.isGameActive) {
            window.isGameActive = false;
            btnPause.textContent = 'Resume';
        } else {
            window.isGameActive = true;
            window.startTimerCountdown();
            btnPause.textContent = 'Pause';
        }
    });

    // Flip board orientation
    document.getElementById('btn-flip').addEventListener('click', () => {
        window.isBoardFlipped = !window.isBoardFlipped;
        renderBoard();
    });
});