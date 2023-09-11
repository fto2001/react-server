export default {
    saveGameState,
    loadGameState
}

function saveGameState(gameState) {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}
  
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    return savedState ? JSON.parse(savedState) : null;
}

