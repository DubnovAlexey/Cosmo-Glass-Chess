/* ==========================================================================
   CHESS RENDER MODULE: 10x10 Grid Framework and Tap-to-Move Interaction
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

// 2. 10x10 BOARD GENERATION ENGINE
function renderBoard() {
    if (!chessboard) return;
    chessboard.innerHTML = '';

    const board = window.getBoardMatrix();
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // Render a 10x10 structural matrix (Rows 0-9, Columns 0-9)
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');

            // Determine if the current cell belongs to the outer border rim
            const isTopBorder = (y === 0);
            const isBottomBorder = (y === 9);
            const isLeftBorder = (x === 0);
            const isRightBorder = (x === 9);
            const isFrameCell = isTopBorder || isBottomBorder || isLeftBorder || isRightBorder;

            if (isFrameCell) {
                // Style as border rim block
                cell.className = 'board-frame-cell';

                // Exclude empty structural corners
                const isCorner = (y === 0 || y === 9) && (x === 0 || x === 9);
                if (!isCorner) {
                    if (isTopBorder || isBottomBorder) {
                        // Dynamically map letters horizontally according to board orientation
                        const j = window.isBoardFlipped ? 7 - (x - 1) : (x - 1);
                        cell.textContent = files[j];
                    } else if (isLeftBorder || isRightBorder) {
                        // Dynamically map numbers vertically according to board orientation
                        const i = window.isBoardFlipped ? 7 - (y - 1) : (y - 1);
                        cell.textContent = ranks[i];
                    }
                }
                chessboard.appendChild(cell);
            } else {
                // Map inner 8x8 space to traditional chess matrix indices
                const i = y - 1;
                const j = x - 1;

                const r = window.isBoardFlipped ? 7 - i : i;
                const c = window.isBoardFlipped ? 7 - j : j;

                cell.className = `board-tile ${(r + c) % 2 === 0 ? 'tile-light' : 'tile-dark'}`;

                const squareId = files[c] + ranks[r];
                cell.dataset.square = squareId;

                const piece = board[r][c];
                if (piece) {
                    const pDiv = document.createElement('div');
                    const pieceClassName = `${piece.color}_${PIECE_MAP[piece.type]}`;
                    pDiv.className = `chess-piece ${pieceClassName}`;
                    cell.appendChild(pDiv);
                }

                cell.addEventListener('click', () => handleSquareClick(squareId));
                chessboard.appendChild(cell);
            }
        }
    }
}

// 3. TAP-TO-MOVE LOGIC
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