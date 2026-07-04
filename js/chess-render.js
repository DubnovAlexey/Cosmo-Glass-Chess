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

// Global state for selected square (e.g., 'e2')
window.selectedSquare = null;

// 2. BOARD RENDERING
function renderBoard() {
    if (!chessboard) return;
    chessboard.innerHTML = '';

    const board = window.getBoardMatrix();
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // Generate 64 squares
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // Adjust coordinates if board is flipped
            const r = window.isBoardFlipped ? 7 - i : i;
            const c = window.isBoardFlipped ? 7 - j : j;

            const tile = document.createElement('div');
            tile.className = `board-tile ${(r + c) % 2 === 0 ? 'tile-light' : 'tile-dark'}`;
            tile.dataset.row = r;
            tile.dataset.col = c;

            const squareId = files[c] + ranks[r];
            tile.dataset.square = squareId;

            // Render piece if exists
            const piece = board[r][c];
            if (piece) {
                const pDiv = document.createElement('div');
                const pieceClassName = `${piece.color}_${PIECE_MAP[piece.type]}`;
                pDiv.className = `chess-piece ${pieceClassName}`;
                tile.appendChild(pDiv);
            }

            // Attach universal click/tap listener
            tile.addEventListener('click', () => handleSquareClick(squareId, r, c));
            chessboard.appendChild(tile);
        }
    }
}

// 3. TAP-TO-MOVE LOGIC
function handleSquareClick(squareId, row, col) {
    if (!window.isGameActive) return;

    // Case A: A piece is already selected
    if (window.selectedSquare) {
        const moveAttempt = window.game.move({
            from: window.selectedSquare,
            to: squareId,
            promotion: 'q' // Auto-promote to queen
        });

        if (moveAttempt) {
            // Valid move executed
            window.selectedSquare = null;
            renderBoard();
            if (typeof window.updateTimerVisualActiveState === 'function') {
                window.updateTimerVisualActiveState();
            }
        } else {
            // Invalid move: check if clicked on another own piece
            const piece = window.game.get(squareId);
            if (piece && piece.color === window.game.turn()) {
                window.selectedSquare = squareId;
                highlightValidMoves(squareId);
            } else {
                // Cancel selection
                window.selectedSquare = null;
                renderBoard();
            }
        }
    } else {
        // Case B: No piece selected yet
        const piece = window.game.get(squareId);
        if (piece && piece.color === window.game.turn()) {
            window.selectedSquare = squareId;
            highlightValidMoves(squareId);
        }
    }
}

// 4. VISUAL FEEDBACK (HIGHLIGHTS)
function highlightValidMoves(squareId) {
    // Clear previous highlights
    document.querySelectorAll('.board-tile').forEach(tile => {
        tile.classList.remove('highlight-selected', 'highlight-move');
    });

    // Highlight selected piece
    const selectedTile = document.querySelector(`.board-tile[data-square="${squareId}"]`);
    if (selectedTile) selectedTile.classList.add('highlight-selected');

    // Get and highlight possible moves
    const moves = window.game.moves({ square: squareId, verbose: true });
    moves.forEach(move => {
        const targetTile = document.querySelector(`.board-tile[data-square="${move.to}"]`);
        if (targetTile) {
            targetTile.classList.add('highlight-move');
        }
    });
}