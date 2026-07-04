/* ==========================================================================
   CHESS LOGIC MODULE: Game engine and validation
   ========================================================================== */

// Initialize chess.js game instance
window.game = new Chess();

// Return the current 2D array representation of the board
window.getBoardMatrix = function() {
    return window.game.board();
};

// Validate and execute a move using chess.js
window.isValidMove = function(sRow, sCol, tRow, tCol) {
    // Map 0-7 indexes to standard chess notation (files a-h, ranks 8-1)
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // Attempt to make the move in the game engine
    const move = window.game.move({
        from: files[sCol] + ranks[sRow],
        to: files[tCol] + ranks[tRow], // Fixed logic: maps correct column and row
        promotion: 'q' // Automatically promote to queen for simplicity
    });

    // If move is valid, chess.js updates internal state and returns the move object
    // If invalid, it returns null
    return move !== null;
};