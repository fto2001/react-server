export default function GameDirection({ game }) {
    function move(direction) {
      game.moveTiles(direction);
    }
  
    function moveLeft() {
      game.moveLeft();
    }
  
    function moveRight() {
      game.moveRight();
    }
  
    function moveUp() {
      game.moveUp();
    }
  
    function moveDown() {
      game.moveDown();
    }
  
    return {
      move,
      moveLeft,
      moveRight,
      moveUp,
      moveDown
    };
  }
