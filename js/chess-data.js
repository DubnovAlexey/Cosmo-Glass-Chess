/* ==========================================================================
   CHESS DATA MODULE: Global application state
   ========================================================================== */

window.isGameActive = false;
window.whiteTime = 600;
window.blackTime = 600;
window.timerInterval = null;
window.isBoardFlipped = false;

// NEW: Store the user's chosen color ('w' for White, 'b' for Black)
window.playerColor = 'w';

window.draggedPieceElement = null;
window.sourceRow = null;
window.sourceCol = null;