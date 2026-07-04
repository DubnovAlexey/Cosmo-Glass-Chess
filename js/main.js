/* ==========================================================================
   MAIN MODULE: Application initialization and Event Listeners
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderBoard();

    // Helper function to format seconds into MM:SS display
    const formatTimeDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // UI Elements
    const timerW = document.getElementById('timer-w');
    const timerB = document.getElementById('timer-b');
    const timeInput = document.getElementById('time-input');

    // 1. SET TIME BUTTON LOGIC
    document.getElementById('btn-set-time').addEventListener('click', () => {
        if (window.isGameActive) {
            alert('You cannot change the time while the match is active!');
            return;
        }

        // Parse float allows decimals (e.g., 1.5 minutes = 90 seconds)
        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 0.1; // Minimum allowed time

        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;

        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);
    });

    // 2. START MATCH BUTTON LOGIC
    document.getElementById('btn-start').addEventListener('click', () => {
        if (!window.isGameActive) {
            window.isGameActive = true;
            window.startTimerCountdown();
        }
    });

    // 3. RESTART BUTTON LOGIC
    document.getElementById('btn-restart').addEventListener('click', () => {
        window.game.reset();
        window.isGameActive = false;
        clearInterval(window.timerInterval);

        // Reset time based on the current input value
        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 10; // Default to 10 if empty

        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;

        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);

        renderBoard();
    });
});