import React, { useState, useEffect } from 'react';

export default function TileGame() {
  const [rows, setRows] = useState(4);
  const [columns, setColumns] = useState(4);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [mergedTiles, setMergedTiles] = useState([]);
  const [swipeStartX, setSwipeStartX] = useState(0);
  const [swipeStartY, setSwipeStartY] = useState(0);
  const [swipeEndX, setSwipeEndX] = useState(0);
  const [swipeEndY, setSwipeEndY] = useState(0);

  useEffect(() => {
    initialize();
  }, []);

  function initialize() {
    setBoard(Array.from({ length: rows }, () => Array(columns).fill(0)));
    updateBoard();
  }

  function updateBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const tileValue = board[row][column];
        const tile = createTileElement(tileValue);
        boardElement.appendChild(tile);
      }
    }

    const scoreDisplay = document.getElementsByClassName('tab-score')[0];
    const bestScoreDisplay = document.getElementsByClassName('best-score')[0];

    scoreDisplay.innerText = score;
    bestScoreDisplay.innerText = bestScore;
  }

  function generateTileColor(value) {
    const hueStart = 0;
    const hueEnd = 120;
    const hueStep = (hueEnd - hueStart) / 11;
    const hue = (Math.log2(value) % 12) * hueStep + hueStart;
    const saturation = 50;
    const lightness = 50;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  function createTileElement(num) {
    const tile = document.createElement("div");

    tile.className = "tile x" + num;
    tile.textContent = num > 0 ? num : "";
    tile.style.backgroundColor = generateTileColor(num);

    return tile;
  }

  function setRandomTileToBoard() {
    const emptyTiles = [];

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (board[row][column] === 0) {
          emptyTiles.push({ row: row, column: column });
        }
      }
    }

    if (emptyTiles.length === 0) return;

    const randomNumber = Math.floor(Math.random() * emptyTiles.length);
    const tile = emptyTiles[randomNumber];
    const newBoard = [...board];
    newBoard[tile.row][tile.column] = Math.random() < 0.9 ? 2 : 4;
    setBoard(newBoard);
    setTimeout(() => {
      updateBoard();
    }, 220);
  }

  function resetMergeState() {
    const newMergedTiles = Array.from({ length: rows }, () => Array(columns).fill(false));
    setMergedTiles(newMergedTiles);
  }

  function markTileAsMerged(row, column) {
    const newMergedTiles = [...mergedTiles];
    newMergedTiles[row][column] = true;
    setMergedTiles(newMergedTiles);
  }

  function isTileMerged(row, column) {
    return mergedTiles[row][column];
  }

  function moveTiles(direction) {
    resetMergeState();

    if (!isCanMove()) {
      showGameOverAlert();
      return;
    }

    let isMoved = false;

    for (let primary = 0; primary < rows; primary++) {
      for (let secondary = 0; secondary < columns; secondary++) {
        const row = direction === "up" ? primary : direction === "down" ? rows - 1 - primary : secondary;
        const column = direction === "left" ? primary : direction === "right" ? columns - 1 - primary : secondary;

        if (board[row][column] !== 0) {
          let newRow = row;
          let newColumn = column;

          while (true) {
            const verticalMove = (direction === "down" ? 1 : direction === "up" ? -1 : 0);
            const horizontalMove = (direction === "right" ? 1 : direction === "left" ? -1 : 0);
            const nextRow = newRow + verticalMove;
            const nextColumn = newColumn + horizontalMove;

            if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns) {
              break;
            }

            if (board[nextRow][nextColumn] === 0) {
              const tileValue = board[newRow][newColumn];
              if (tileValue !== 0) {
                const tileElements = document.querySelectorAll('.tile');
                const tileOrdinalNumber = newRow * 4 + newColumn;
                const targetTileElement = tileElements[tileOrdinalNumber];

                if(targetTileElement && !targetTileElement.classList.contains('x0')) {
                  targetTileElement.classList.add(`move-${direction}`);
                  setTimeout(() => {
                    if(targetTileElement) {
                      targetTileElement.classList.remove(`move-${direction}`);
                      targetTileElement.textContent = tileValue;
                    }
                  }, 210);
                }
              }

              const newBoard = [...board];
              newBoard[nextRow][nextColumn] = board[newRow][newColumn];
              newBoard[newRow][newColumn] = 0;
              setBoard(newBoard);
              newRow = nextRow;
              newColumn = nextColumn;
              isMoved = true;
            } else if (board[nextRow][nextColumn] === board[newRow][newColumn]) {
              if (!isTileMerged(nextRow, nextColumn) && !isTileMerged(newRow, newColumn)) {
                const tileElements = document.querySelectorAll('.tile');
                const tileOrdinalNumber = newRow * 4 + newColumn;
                const targetTileElement = tileElements[tileOrdinalNumber];

                if(targetTileElement && !targetTileElement.classList.contains('x0')) {
                  targetTileElement.classList.add(`move-${direction}`);
                  setTimeout(() => {
                    if(targetTileElement) {
                      targetTileElement.classList.remove(`move-${direction}`);
                    }
                  }, 230);
                }

                const newBoard = [...board];
                newBoard[nextRow][nextColumn] *= 2;
                setScore(score + newBoard[nextRow][nextColumn]);
                if (score + newBoard[nextRow][nextColumn] > bestScore) {
                  setBestScore(score + newBoard[nextRow][nextColumn]);
                }
                newBoard[newRow][newColumn] = 0;
                setBoard(newBoard);
                markTileAsMerged(nextRow, nextColumn);
                isMoved = true;
              }
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (isMoved) {
      saveGameState();
      resetMergeState();
      setRandomTileToBoard();
    }
  }

  function moveLeft() {
    moveTiles("left");
  }

  function moveRight() {
    moveTiles("right");
  }

  function moveUp() {
    moveTiles("up");
  }

  function moveDown() {
    moveTiles("down");
  }

  function isCanMove() {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const canMoveEmptyCell = board[row][column] === 0;
        const canMoveUp = column > 0 && board[row][column] === board[row][column - 1];
        const canMoveRight = row > 0 && board[row][column] === board[row - 1][column];

        if (canMoveEmptyCell || canMoveUp || canMoveRight) return true;
      }
    }

    return false;
  }

  function showGameOverAlert() {
    const fail = new Audio("sounds/fail-wha-wha-version.mp3");

    alert("Game over, you lost");
    fail.play();
    resetGame();
  }

  function handleSwipe() {
    const deltaX = swipeEndX - swipeStartX;
    const deltaY = swipeEndY - swipeStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    } else {
      if (deltaY > 0) {
        moveDown();
      } else {
        moveUp();
      }
    }
  }

  function resetGame() {
    localStorage.removeItem('gameState');
    const newBoard = Array.from({ length: rows }, () => Array(columns).fill(0));
    setBoard(newBoard);
    setScore(0);
    const newMergedTiles = Array.from({ length: rows }, () => Array(columns).fill(false));
    setMergedTiles(newMergedTiles);
    updateBoard();
    setRandomTileToBoard();
    setRandomTileToBoard();
  }

  function resetGameConfirm() {
    /* eslint-disable no-restricted-globals */
    const reset = confirm('Do you want to reset your game?');

    if (reset) {
      resetGame();
    }
  }

  function askToRestoreProgress() {
    /* eslint-disable no-restricted-globals */
    const restore = confirm('Do you want to restore your progress?');

    if (restore) {
      loadGameState();
    } else {
      resetGame();
    }
  }

  function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify({ board, score, mergedTiles, bestScore }));
  }

  function loadGameState() {
    const savedState = localStorage.getItem('gameState');

    if (savedState) {
      const { board: savedBoard, score: savedScore, mergedTiles: savedMergedTiles, bestScore: savedBestScore } = JSON.parse(savedState);
      setBoard(savedBoard);
      setScore(savedScore);
      setMergedTiles(savedMergedTiles);
      setBestScore(savedBestScore);
      updateBoard();
    }
  }

  return (
    <section className="container">
      <div className="container-title">
        <h1 className="container-title__name">2048</h1>
        <button className="container-title__button" id="resetButton"><i className="fa-solid fa-arrows-rotate"></i></button>
      </div>
      <div className="board" id="board"></div>
      <div className="container-score">
        <div className="score">Score: <span className="tab-score">0</span></div>
      </div>
      <div className="container-best-score">
        <div className="score">Best Score: <span className="best-score">0</span></div>
      </div>
    </section>
  );
}
