/* ==========================================================================
   CHESS DATA MODULE: Global application state
   ========================================================================== */

window.isGameActive = false;
window.whiteTime = 600;
window.blackTime = 600;
window.timerInterval = null;
window.isBoardFlipped = false;

window.draggedPieceElement = null;
window.sourceRow = null;
window.sourceCol = null;