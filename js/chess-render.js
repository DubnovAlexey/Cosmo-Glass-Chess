/* ==========================================================================
   CHESS RENDER MODULE: Board Generation and Tap-to-Move Interaction
   ========================================================================== */

// 1. DOM ELEMENTS & CONSTANTS
const chessboard = document.getElementById('chessboard');

const PIECE_MAP = {
    'p': 'pawn',
    'r': 'rook',
    'n': 'knight',
    'b': 'bishop',
    'q': 'queen',
    'k': 'king'
};

window.selectedSquare = null;

// 2. BOARD RENDERING
function renderBoard() {
    if (!chessboard) return;
    chessboard.innerHTML = '';

    const board = window.getBoardMatrix();
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const r = window.isBoardFlipped ? 7 - i : i;
            const c = window.isBoardFlipped ? 7 - j : j;

            const tile = document.createElement('div');
            tile.className = `board-tile ${(r + c) % 2 === 0 ? 'tile-light' : 'tile-dark'}`;
            tile.dataset.row = r.toString();
            tile.dataset.col = c.toString();

            const squareId = files[c] + ranks[r];
            tile.dataset.square = squareId;

            const piece = board[r][c];
            if (piece) {
                const pDiv = document.createElement('div');
                const pieceClassName = `${piece.color}_${PIECE_MAP[piece.type]}`;
                pDiv.className = `chess-piece ${pieceClassName}`;
                tile.appendChild(pDiv);
            }

            // Updated: Removed unused row and col parameters
            tile.addEventListener('click', () => handleSquareClick(squareId));
            chessboard.appendChild(tile);
        }
    }
}

// 3. TAP-TO-MOVE LOGIC
// Updated: Removed unused row and col parameters
function handleSquareClick(squareId) {
    if (!window.isGameActive) return;

    if (window.selectedSquare) {
        const moveAttempt = window.game.move({
            from: window.selectedSquare,
            to: squareId,
            promotion: 'q'
        });

        if (moveAttempt) {
            window.selectedSquare = null;
            renderBoard();
            if (typeof window.updateTimerVisualActiveState === 'function') {
                window.updateTimerVisualActiveState();
            }
        } else {
            const piece = window.game.get(squareId);
            if (piece && piece.color === window.game.turn()) {
                window.selectedSquare = squareId;
                highlightValidMoves(squareId);
            } else {
                window.selectedSquare = null;
                renderBoard();
            }
        }
    } else {
        const piece = window.game.get(squareId);
        if (piece && piece.color === window.game.turn()) {
            window.selectedSquare = squareId;
            highlightValidMoves(squareId);
        }
    }
}

// 4. VISUAL FEEDBACK (HIGHLIGHTS)
function highlightValidMoves(squareId) {
    document.querySelectorAll('.board-tile').forEach(tile => {
        tile.classList.remove('highlight-selected', 'highlight-move');
    });

    const selectedTile = document.querySelector(`.board-tile[data-square="${squareId}"]`);
    if (selectedTile) selectedTile.classList.add('highlight-selected');

    const moves = window.game.moves({ square: squareId, verbose: true });

    moves.forEach(move => {
        const targetTile = document.querySelector(`.board-tile[data-square="${move.to}"]`);
        if (targetTile) {
            targetTile.classList.add('highlight-move');
        }
    });
}