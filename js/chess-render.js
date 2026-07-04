/* ==========================================================================
   CHESS RENDER MODULE: 10x10 Grid Framework and Tap-to-Move Interaction
   ========================================================================== */

// 1. DOM ELEMENTS, CONSTANTS & AUDIO
const chessboard = document.getElementById('chessboard');

const PIECE_MAP = { 'p': 'pawn', 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king' };

window.selectedSquare = null;

const moveSound = new Audio('./assets/audio/move.mp3');
const captureSound = new Audio('./assets/audio/capture.mp3');
const checkSound = new Audio('./assets/audio/check.mp3');

// 2. 10x10 BOARD GENERATION ENGINE
function renderBoard() {
    if (!chessboard) return;
    chessboard.innerHTML = '';

    const board = window.getBoardMatrix();
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div');

            const isTopBorder = (y === 0), isBottomBorder = (y === 9);
            const isLeftBorder = (x === 0), isRightBorder = (x === 9);
            const isFrameCell = isTopBorder || isBottomBorder || isLeftBorder || isRightBorder;

            if (isFrameCell) {
                cell.className = 'board-frame-cell';
                const isCorner = (y === 0 || y === 9) && (x === 0 || x === 9);
                if (!isCorner) {
                    if (isTopBorder || isBottomBorder) cell.textContent = files[window.isBoardFlipped ? 7 - (x - 1) : (x - 1)];
                    else if (isLeftBorder || isRightBorder) cell.textContent = ranks[window.isBoardFlipped ? 7 - (y - 1) : (y - 1)];
                }
                chessboard.appendChild(cell);
            } else {
                const r = window.isBoardFlipped ? 7 - (y - 1) : (y - 1);
                const c = window.isBoardFlipped ? 7 - (x - 1) : (x - 1);

                cell.className = `board-tile ${(r + c) % 2 === 0 ? 'tile-light' : 'tile-dark'}`;
                const squareId = files[c] + ranks[r];
                cell.dataset.square = squareId;

                const piece = board[r][c];
                if (piece) {
                    const pDiv = document.createElement('div');
                    pDiv.className = `chess-piece ${piece.color}_${PIECE_MAP[piece.type]}`;
                    cell.appendChild(pDiv);
                }

                cell.addEventListener('click', () => handleSquareClick(squareId));
                chessboard.appendChild(cell);
            }
        }
    }

    highlightCheck();
    updateGraveyards();
}

function highlightCheck() {
    document.querySelectorAll('.highlight-check').forEach(el => el.classList.remove('highlight-check'));

    if (window.game.in_check()) {
        const turn = window.game.turn();
        const board = window.getBoardMatrix();
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (piece && piece.type === 'k' && piece.color === turn) {
                    const squareId = files[c] + ranks[r];
                    const kingTile = document.querySelector(`.board-tile[data-square="${squareId}"]`);
                    if (kingTile) kingTile.classList.add('highlight-check');
                    return;
                }
            }
        }
    }
}

// 3. TAP-TO-MOVE & PROMOTION LOGIC
function handleSquareClick(squareId) {
    if (!window.isGameActive) return;

    if (window.selectedSquare) {
        const piece = window.game.get(window.selectedSquare);
        const isPawn = piece && piece.type === 'p';
        const isPromotionRank = squareId.includes('1') || squareId.includes('8');

        // Проверяем, является ли клик легальным ходом
        const validMoves = window.game.moves({ square: window.selectedSquare, verbose: true });
        const isValidTarget = validMoves.some(m => m.to === squareId);

        // Если это пешка на последней линии - вызываем паузу и модальное окно
        if (isValidTarget && isPawn && isPromotionRank) {
            showPromotionModal(window.selectedSquare, squareId, piece.color);
            return;
        }

        // Обычный ход
        executeMove(window.selectedSquare, squareId, 'q');
    } else {
        const piece = window.game.get(squareId);
        if (piece && piece.color === window.game.turn()) {
            window.selectedSquare = squareId;
            highlightValidMoves(squareId);
        }
    }
}

// НОВОЕ: Окно выбора фигуры
function showPromotionModal(fromSquare, toSquare, color) {
    // Останавливаем таймер
    clearInterval(window.timerInterval);

    const modal = document.getElementById('promotion-modal');
    const optionsContainer = document.getElementById('promotion-options');
    optionsContainer.innerHTML = '';

    const pieces = ['q', 'r', 'b', 'n']; // Ферзь, Ладья, Слон, Конь
    pieces.forEach(p => {
        const btn = document.createElement('button');
        btn.className = `promo-btn ${color}_${PIECE_MAP[p]}`;
        btn.onclick = () => {
            modal.close();
            executeMove(fromSquare, toSquare, p);

            // Возобновляем таймер после хода
            if (window.isGameActive) window.startTimerCountdown();
        };
        optionsContainer.appendChild(btn);
    });

    modal.showModal();
}

// НОВОЕ: Исполнение самого хода (вынесено отдельно)
function executeMove(fromSquare, toSquare, promotionPiece) {
    const moveAttempt = window.game.move({ from: fromSquare, to: toSquare, promotion: promotionPiece });

    if (moveAttempt) {
        window.selectedSquare = null;

        if (window.game.in_check()) {
            checkSound.currentTime = 0;
            checkSound.play().catch(err => console.log("Audio blocked:", err));
        } else if (moveAttempt.captured) {
            captureSound.currentTime = 0;
            captureSound.play().catch(err => console.log("Audio blocked:", err));
        } else {
            moveSound.currentTime = 0;
            moveSound.play().catch(err => console.log("Audio blocked:", err));
        }

        renderBoard();
        if (typeof window.updateTimerVisualActiveState === 'function') window.updateTimerVisualActiveState();
        document.dispatchEvent(new CustomEvent('chessMoveCompleted'));

    } else {
        const piece = window.game.get(toSquare);
        if (piece && piece.color === window.game.turn()) {
            window.selectedSquare = toSquare;
            highlightValidMoves(toSquare);
        } else {
            window.selectedSquare = null;
            renderBoard();
        }
    }
}

// 4. VISUAL FEEDBACK (HIGHLIGHTS)
function highlightValidMoves(squareId) {
    document.querySelectorAll('.board-tile').forEach(tile => tile.classList.remove('highlight-selected', 'highlight-move'));
    const selectedTile = document.querySelector(`.board-tile[data-square="${squareId}"]`);
    if (selectedTile) selectedTile.classList.add('highlight-selected');

    window.game.moves({ square: squareId, verbose: true }).forEach(move => {
        const targetTile = document.querySelector(`.board-tile[data-square="${move.to}"]`);
        if (targetTile) targetTile.classList.add('highlight-move');
    });
}

// 5. GRAVEYARD RENDERING LOGIC
function updateGraveyards() {
    const graveW = document.getElementById('graveyard-white'), graveB = document.getElementById('graveyard-black');
    if (!graveW || !graveB) return;
    graveW.innerHTML = ''; graveB.innerHTML = '';

    window.game.history({ verbose: true }).forEach(move => {
        if (move.captured) {
            const capturedColor = move.color === 'w' ? 'b' : 'w';
            const pDiv = document.createElement('div');
            pDiv.className = `graveyard-piece ${capturedColor}_${PIECE_MAP[move.captured]}`;
            capturedColor === 'w' ? graveW.appendChild(pDiv) : graveB.appendChild(pDiv);
        }
    });
}