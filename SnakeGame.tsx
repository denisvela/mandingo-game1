import React, { useEffect, useRef } from 'react';
import { useGameLogic } from '../game/useGameLogic';
import GameControls from './GameControls';
import GameOverScreen from './GameOverScreen';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameState,
    score,
    highScore,
    isGameOver,
    isPaused,
    startGame,
    resetGame,
    pauseGame,
    setDirection,
  } = useGameLogic(canvasRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          setDirection('up');
          break;
        case 'ArrowDown':
        case 's':
          setDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
          setDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
          setDirection('right');
          break;
        case ' ':
          if (isGameOver) {
            resetGame();
          } else {
            pauseGame();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setDirection, isGameOver, resetGame, pauseGame]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-md mb-4">
        <div className="text-white text-xl">Score: {score}</div>
        <div className="text-white text-xl">High Score: {highScore}</div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-4 border-purple-700 bg-black"
        />
        
        {isGameOver && <GameOverScreen score={score} onRestart={resetGame} />}
        
        {!isGameOver && isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-white text-3xl font-bold">PAUSED</div>
          </div>
        )}
      </div>
      
      <GameControls
        onStart={startGame}
        onPause={pauseGame}
        onReset={resetGame}
        onDirectionChange={setDirection}
        isPaused={isPaused}
        isGameOver={isGameOver}
      />
      
      <div className="text-white mt-4 text-center max-w-md">
        <p className="mb-2">Use arrow keys or WASD to move.</p>
        <p>Press Space to pause/resume the game.</p>
      </div>
    </div>
  );
};

export default SnakeGame;
