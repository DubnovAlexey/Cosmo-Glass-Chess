/* ============================================================================
 * ФАЙЛ: js/chess-logic.js
 * НАЗНАЧЕНИЕ: Правила chess.js и последовательный UCI-поиск с отменой старых ходов.
 * РАЗДЕЛЫ: 1. Worker и очередь; 2. Применение хода; 3. События и освобождение.
 * ============================================================================ */
window.game = new Chess();
let generation = 0, activeSearch = null, pendingSearch = null, moveTimer = null;
let waitingFen = null;

// НАЧАЛО РАЗДЕЛА 1
function startSearch(request) {
    activeSearch = request;
    window.engine.postMessage('position fen ' + request.fen);
    window.engine.postMessage(`go depth ${request.level}`);
}
function setupEngine() {
    const engine = new Worker('./assets/js/stockfish.js');
    window.engine = engine;
    engine.postMessage('uci'); engine.postMessage('isready');
    engine.onmessage = (event) => {
        if (window.engine !== engine) return; // Запоздалый callback уничтоженного Worker не отвечает за новый поиск.
        const match = /^bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?|\(none\))/.exec(String(event.data));
        if (!match || !activeSearch) return;
        const request = activeSearch; activeSearch = null;
        const queued = pendingSearch; pendingSearch = null;
        if (queued) { startSearch(queued); return; }
        if (match[1] === '(none)' || request.generation !== generation || !window.isGameActive || window.game.fen() !== request.fen) return;
        waitingFen = request.fen;
        moveTimer = setTimeout(() => {
            moveTimer = null; waitingFen = null;
            if (request.generation !== generation || !window.isGameActive || window.game.fen() !== request.fen || window.game.turn() === window.playerColor) return;
            const move = window.game.move(match[1], { sloppy: true });
            if (!move) return;
            const sound = window.game.in_check() ? 'check' : move.captured ? 'capture' : 'move';
            new Audio(`./assets/audio/${sound}.mp3`).play().catch(() => {});
            window.renderBoard?.(); window.updateTimerVisualActiveState?.();
            document.dispatchEvent(new CustomEvent('chessMoveCompleted'));
        }, 600);
    };
}
window.cancelEngineSearch = () => {
    generation++; pendingSearch = null; waitingFen = null;
    clearTimeout(moveTimer); moveTimer = null;
    if (activeSearch) window.engine?.postMessage('stop');
};
function requestEngineMove(level) {
    const request = { fen: window.game.fen(), level, generation };
    if (waitingFen === request.fen || activeSearch?.fen === request.fen && activeSearch.generation === generation) return;
    if (activeSearch) { pendingSearch = request; window.engine.postMessage('stop'); }
    else startSearch(request);
}
setupEngine();
// КОНЕЦ РАЗДЕЛА 1

// НАЧАЛО РАЗДЕЛА 2
window.getBoardMatrix = () => window.game.board();
window.isValidMove = (sRow, sCol, tRow, tCol) => {
    const files = 'abcdefgh', ranks = '87654321';
    return window.game.move({ from: files[sCol] + ranks[sRow], to: files[tCol] + ranks[tRow], promotion: 'q' }) !== null;
};
// КОНЕЦ РАЗДЕЛА 2

// НАЧАЛО РАЗДЕЛА 3
document.addEventListener('chessMoveCompleted', () => {
    if (window.game.in_checkmate()) {
        const winner = window.game.turn() === 'w' ? 'Black' : 'White';
        new Audio('./assets/audio/end.mp3').play().catch(() => {});
        window.endGame(`Checkmate! ${winner} wins!`); return;
    }
    if (window.game.in_draw() || window.game.in_stalemate() || window.game.in_threefold_repetition()) {
        window.endGame('Match ended in a Draw!'); return;
    }
    const level = Number.parseInt(document.getElementById('ai-level-select')?.value || '0', 10);
    if (window.isGameActive && level > 0 && window.game.turn() !== window.playerColor) requestEngineMove(level);
});
window.addEventListener('pagehide', () => {
    window.cancelEngineSearch(); activeSearch = null;
    window.engine?.terminate(); window.engine = null;
});
window.addEventListener('pageshow', () => {
    if (window.engine) return;
    setupEngine();
    // BFCache возвращает ту же партию: восстановление использует обычные terminal/level/turn проверки.
    if (window.isGameActive) document.dispatchEvent(new CustomEvent('chessMoveCompleted'));
});
// КОНЕЦ РАЗДЕЛА 3
