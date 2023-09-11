import React from 'react';
import TileGame from './tile-game.js';
import LocalStorageData from './local-storage-data.js';
import GameSwipeAndKey from './game-swipe-and-key.js';
import GameDirection from './game-direction.js'; 

export default function Main() {
  return (
    <div className="App">
      <TileGame />
      <LocalStorageData />
      <GameSwipeAndKey />
      <GameDirection />
    </div>
  );
}