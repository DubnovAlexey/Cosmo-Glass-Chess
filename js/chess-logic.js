/* ==========================================================================
   CHESS LOGIC MODULE: Game engine, validation, and AI (Stockfish) integration
   ========================================================================== */

// Initialize chess.js game instance
window.game = new Chess();

// 1. WEB WORKER: INITIALIZE STOCKFISH ENGINE
window.engine = new Worker('./assets/js/stockfish.js');
window.engine.postMessage('uci');
window.engine.postMessage('isready');

// 2. LISTEN FOR AI RESPONSES
window.engine.onmessage = function(event) {
    const message = event.data;

    if (message && message.includes('bestmove')) {
        const moveStr = message.split(' ')[1];

        if (moveStr && moveStr !== '(none)') {

            // Artificial delay of 600 milliseconds for AI move to feel natural
            setTimeout(() => {
                const moveAttempt = window.game.move(moveStr, { sloppy: true });

                // Contextual Audio Logic for AI moves
                if (window.game.in_check()) {
                    new Audio('./assets/audio/check.mp3').play().catch(e => console.log(e));
                } else if (moveAttempt && moveAttempt.captured) {
                    new Audio('./assets/audio/capture.mp3').play().catch(e => console.log(e));
                } else {
                    new Audio('./assets/audio/move.mp3').play().catch(e => console.log(e));
                }

                if (typeof window.renderBoard === 'function') {
                    window.renderBoard();
                }

                if (typeof window.updateTimerVisualActiveState === 'function') {
                    window.updateTimerVisualActiveState();
                }

                // Hand over the turn back to the player
                document.dispatchEvent(new CustomEvent('chessMoveCompleted'));

            }, 600);
        }
    }
};

// Return the current 2D array representation of the board
window.getBoardMatrix = function() {
    return window.game.board();
};

// Validate and execute a move using chess.js
window.isValidMove = function(sRow, sCol, tRow, tCol) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const move = window.game.move({
        from: files[sCol] + ranks[sRow],
        to: files[tCol] + ranks[tRow],
        promotion: 'q'
    });

    return move !== null;
};

// 3. OBSERVER / EVENT LISTENER FOR GAME STATE & AI TRIGGER
document.addEventListener('chessMoveCompleted', () => {
    // Check for Checkmate
    if (window.game.in_checkmate()) {
        const winner = window.game.turn() === 'w' ? 'Black' : 'White';
        const endSound = new Audio('./assets/audio/end.mp3');
        endSound.play().catch(e => console.log(e));
        setTimeout(() => window.endGame(`Checkmate! ${winner} wins!`), 100);
        return;
    }

    // Check for Draw scenarios
    if (window.game.in_draw() || window.game.in_stalemate() || window.game.in_threefold_repetition()) {
        setTimeout(() => window.endGame("Match ended in a Draw!"), 100);
        return;
    }

    // AI Trigger Logic (Dynamic Color Selection)
    const aiSelect = document.getElementById('ai-level-select');
    const aiLevel = aiSelect ? parseInt(aiSelect.value) : 0;

    if (window.isGameActive && aiLevel > 0 && window.game.turn() !== window.playerColor) {
        window.engine.postMessage('position fen ' + window.game.fen());
        window.engine.postMessage(`go depth ${aiLevel}`);
    }
});