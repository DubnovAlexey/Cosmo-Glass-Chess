document.addEventListener('DOMContentLoaded', () => {
    renderBoard();

    const formatTimeDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const timerW = document.getElementById('timer-w');
    const timerB = document.getElementById('timer-b');
    const timeInput = document.getElementById('time-input');

    const timeModal = document.getElementById('time-modal');
    const btnOpenModal = document.getElementById('btn-open-time-modal');
    const btnCancelTime = document.getElementById('btn-cancel-time');
    const btnConfirmTime = document.getElementById('btn-confirm-time');

    btnOpenModal.addEventListener('click', () => {
        if (window.isGameActive) {
            alert('You cannot change the time while the match is active!');
            return;
        }
        timeModal.showModal();
    });

    btnCancelTime.addEventListener('click', () => {
        timeModal.close();
    });

    btnConfirmTime.addEventListener('click', () => {
        let minutes = parseFloat(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) minutes = 0.1;

        const totalSeconds = Math.floor(minutes * 60);
        window.whiteTime = totalSeconds;
        window.blackTime = totalSeconds;

        timerW.textContent = formatTimeDisplay(totalSeconds);
        timerB.textContent = formatTimeDisplay(totalSeconds);

        timeModal.close();
    });

    document.getElementById('btn-start').addEventListener('click', () => {
        if (!window.isGameActive) {
            window.isGameActive = true;
            window.startTimerCountdown();
        }
    });

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

        renderBoard();
    });
});