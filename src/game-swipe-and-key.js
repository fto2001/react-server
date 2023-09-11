import { useEffect } from 'react';

export default function GameSwipeAndKey({ game, localStorageData }) {
  useEffect(() => {
    document.addEventListener('keyup', (e) => {
      const key = e.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        game.move(key.substring(5).toLowerCase());
        localStorageData.saveGameState(game);
      }
    });

    document.addEventListener('touchstart', (e) => {
      game.setSwipeStartX(e.touches[0].clientX);
      game.setSwipeStartY(e.touches[0].clientY);
    });

    document.addEventListener('touchend', (e) => {
      game.setSwipeEndX(e.changedTouches[0].clientX);
      game.setSwipeEndY(e.changedTouches[0].clientY);

      localStorageData.saveGameState(game);
      game.handleSwipe();
    });
  }, [game, localStorageData]);

  return null;
}