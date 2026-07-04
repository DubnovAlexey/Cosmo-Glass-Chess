/* ==========================================================================
   CHESS RENDER MODULE: Board rendering logic and DOM manipulation
   ========================================================================== */

const chessboard = document.getElementById('chessboard');

// Mapping dictionary to convert chess.js short types to full image names
const PIECE_MAP = {
    'p': 'pawn',
    'r': 'rook',
    'n': 'knight',
    'b': 'bishop',
    'q': 'queen',
    'k': 'king'
};

function renderBoard() {
    if (!chessboard) return;
    chessboard.innerHTML = ''; // Clear board before re-rendering

    const board = window.getBoardMatrix();

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const tile = document.createElement('div');
            // Assign alternating colors to tiles
            tile.className = `board-tile ${(r + c) % 2 === 0 ? 'tile-light' : 'tile-dark'}`;
            tile.dataset.row = r;
            tile.dataset.col = c;

            const piece = board[r][c];
            if (piece) {
                const pDiv = document.createElement('div');
                // Format exactly matching CSS classes and image files (e.g., "w_pawn")
                const pieceClassName = `${piece.color}_${PIECE_MAP[piece.type]}`;
                pDiv.className = `chess-piece ${pieceClassName}`;
                pDiv.draggable = true;

                // Attach Drag-and-Drop event listeners
                pDiv.addEventListener('dragstart', handleDragStart);
                pDiv.addEventListener('dragend', handleDragEnd);
                tile.appendChild(pDiv);
            }

            // Allow dropping pieces onto tiles
            tile.addEventListener('dragover', (e) => e.preventDefault());
            tile.addEventListener('drop', handleDrop);
            chessboard.appendChild(tile);
        }
    }
}

function handleDragStart(e) {
    window.draggedPieceElement = e.target;
    window.sourceRow = parseInt(window.draggedPieceElement.parentElement.dataset.row);
    window.sourceCol = parseInt(window.draggedPieceElement.parentElement.dataset.col);
}

function handleDragEnd(e) {
    window.draggedPieceElement = null;
}

function handleDrop(e) {
    e.preventDefault();
    if (!window.isGameActive) return;

    // Determine target tile (handles case where dropping directly onto an enemy piece)
    let targetTile = e.target.classList.contains('chess-piece') ? e.target.parentElement : e.target;
    const tRow = parseInt(targetTile.dataset.row);
    const tCol = parseInt(targetTile.dataset.col);

    // Validate and execute move
    if (window.isValidMove(window.sourceRow, window.sourceCol, tRow, tCol)) {
        renderBoard(); // Re-render the board if move is valid
        if (typeof window.updateTimerVisualActiveState === 'function') {
            window.updateTimerVisualActiveState();
        }
    }
}