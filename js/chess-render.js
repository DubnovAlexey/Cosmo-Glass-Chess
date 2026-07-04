/* ==========================================================================
   CHESS RENDER MODULE: Board rendering and Click-to-Move logic
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

// Global state for Tap-to-Move logic
window.selectedSquare = null; // Will store the currently selected square (e.g., 'e2')

function renderBoard() {
    if (!chessboard) return;
    chessboard.innerHTML = ''; // Clear board before re-rendering

    const board = window.getBoardMatrix();
    // Arrays to calculate standard chess notation coordinates
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const tile = document.createElement('div');
            // Assign alternating colors to tiles
            tile.className = `board-tile ${(r + c) % 2 === 0 ? 'tile-light' : 'tile-dark'}`;
            tile.dataset.row = r;
            tile.dataset.col = c;

            // Calculate and assign the standard algebraic notation (e.g., 'e2', 'a8')
            const squareId = files[c] + ranks[r];
            tile.dataset.square = squareId;

            const piece = board[r][c];
            if (piece) {
                const pDiv = document.createElement('div');
                const pieceClassName = `${piece.color}_${PIECE_MAP[piece.type]}`;
                pDiv.className = `chess-piece ${pieceClassName}`;

                // Note: draggable="true" and drag listeners have been removed for unified click logic
                tile.appendChild(pDiv);
            }

            // Universal listener for both Desktop clicks and Mobile taps
            tile.addEventListener('click', () => handleSquareClick(squareId, r, c));
            chessboard.appendChild(tile);
        }
    }
}

function handleSquareClick(squareId, row, col) {
    if (!window.isGameActive) return;

    // 1. Если какая-то фигура УЖЕ была выбрана на предыдущем шаге
    if (window.selectedSquare) {

        // Пытаемся сделать ход средствами библиотеки chess.js
        const moveAttempt = window.game.move({
            from: window.selectedSquare,
            to: squareId,
            promotion: 'q' // Авто-превращение пешки в ферзя (queen)
        });

        if (moveAttempt) {
            // УСПЕХ: Ход валидный и выполнен
            window.selectedSquare = null;
            renderBoard(); // Перерисовываем доску (подсветка исчезнет при перерисовке)
            if (typeof window.updateTimerVisualActiveState === 'function') {
                window.updateTimerVisualActiveState();
            }
        } else {
            // ОШИБКА: Ход невалидный.
            // Проверяем: может игрок просто передумал и кликнул на другую СВОЮ фигуру?
            const piece = window.game.get(squareId);
            if (piece && piece.color === window.game.turn()) {
                window.selectedSquare = squareId; // Выбираем новую фигуру
                highlightValidMoves(squareId);    // Подсвечиваем её ходы
            } else {
                // Иначе просто отменяем выделение (например, клик в пустоту)
                window.selectedSquare = null;
                renderBoard(); // Перерисовываем, чтобы сбросить старую подсветку
            }
        }
    } else {
        // 2. Если ничего не выбрано (первый клик)
        // Проверяем, есть ли на клетке своя фигура (совпадает ли цвет фигуры с текущим ходом)
        const piece = window.game.get(squareId);
        if (piece && piece.color === window.game.turn()) {
            window.selectedSquare = squareId; // Сохраняем ID клетки (например, 'e2')
            highlightValidMoves(squareId);    // Запускаем подсветку
        }
    }
}

// Функция для добавления зеленой рамки возможным ходам
function highlightValidMoves(squareId) {
    // 1. Сначала очищаем старую подсветку со всех клеток
    document.querySelectorAll('.board-tile').forEach(tile => {
        tile.classList.remove('highlight-selected', 'highlight-move');
    });

    // 2. Подсвечиваем саму выбранную фигуру (чтобы понимать, за кого ходим)
    const selectedTile = document.querySelector(`.board-tile[data-square="${squareId}"]`);
    if (selectedTile) selectedTile.classList.add('highlight-selected');

    // 3. Получаем список доступных ходов.
    // Флаг verbose (вербо́уз — подробный) возвращает ходы в виде объектов с детальной инфой
    const moves = window.game.moves({ square: squareId, verbose: true });

    // 4. Проходимся по массиву ходов и добавляем класс подсветки нужным клеткам
    moves.forEach(move => {
        const targetTile = document.querySelector(`.board-tile[data-square="${move.to}"]`);
        if (targetTile) {
            targetTile.classList.add('highlight-move');
        }
    });
}