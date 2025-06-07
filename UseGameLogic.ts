import { useState, useEffect, useRef, RefObject } from 'react';
import { drawGame } from './drawGame';
import { Position, GameState } from '../types/game';

// Initial game settings
const INITIAL_SNAKE_SIZE = 3;
const INITIAL_SPEED = 150;
const MIN_SPEED = 70;
const SPEED_DECREASE_RATE = 2;
const GRID_SIZE = 20;

export const useGameLogic = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const [gameState, setGameState] = useState<GameState>({
    grid: { width: 20, height: 20 },
    snake: [],
    food: { x: 0, y: 0 },
    direction: 'right',
    nextDirection: 'right',
  });
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // Initialize game
  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    
    resetGame();
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Generate random food position
  const generateFood = (snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gameState.grid.width),
        y: Math.floor(Math.random() * gameState.grid.height),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  };

  // Initialize snake
  const initializeSnake = (): Position[] => {
    const centerY = Math.floor(gameState.grid.height / 2);
    return Array.from({ length: INITIAL_SNAKE_SIZE }, (_, i) => ({
      x: Math.floor(gameState.grid.width / 2) - i,
      y: centerY,
    }));
  };

  // Reset game state
  const resetGame = () => {
    const initialSnake = initializeSnake();
    
    setGameState({
      grid: { width: GRID_SIZE, height: GRID_SIZE },
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: 'right',
      nextDirection: 'right',
    });
    
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true);
    setSpeed(INITIAL_SPEED);
    
    // Draw initial game state
    if (canvasRef.current) {
      drawGame(canvasRef.current, {
        snake: initialSnake,
        food: generateFood(initialSnake),
        grid: { width: GRID_SIZE, height: GRID_SIZE },
        direction: 'right',
        nextDirection: 'right',
      });
    }
  };

  // Start game
  const startGame = () => {
    if (isGameOver) {
      resetGame();
    }
    setIsPaused(false);
  };

  // Pause game
  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  // Set direction
  const setDirection = (newDirection: 'up' | 'down' | 'left' | 'right') => {
    if (isPaused || isGameOver) return;
    
    const { direction } = gameState;
    
    // Prevent 180-degree turns
    if (
      (direction === 'up' && newDirection === 'down') ||
      (direction === 'down' && newDirection === 'up') ||
      (direction === 'left' && newDirection === 'right') ||
      (direction === 'right' && newDirection === 'left')
    ) {
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      nextDirection: newDirection,
    }));
  };

  // Game loop
  useEffect(() => {
    if (isPaused || isGameOver) return;
    
    const gameLoop = (timestamp: number) => {
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastUpdateTimeRef.current;
      
      if (elapsed > speed) {
        lastUpdateTimeRef.current = timestamp;
        updateGameState();
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPaused, isGameOver, speed]);

  // Update game state
  const updateGameState = () => {
    setGameState(prev => {
      const { snake, food, grid, nextDirection } = prev;
      
      // Get head position
      const head = snake[0];
      
      // Calculate new head position
      let newHead: Position;
      switch (nextDirection) {
        case 'up':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'down':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'left':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'right':
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          newHead = { ...head };
      }
      
      // Check for collisions
      if (
        // Wall collision
        newHead.x < 0 || newHead.x >= grid.width || newHead.y < 0 || newHead.y >= grid.height ||
        // Self collision (skip the last tail segment as it will move)
        snake.slice(0, -1).some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        return prev;
      }
      
      // Check if food is eaten
      const foodEaten = newHead.x === food.x && newHead.y === food.y;
      
      // Create new snake body
      let newSnake: Position[];
      if (foodEaten) {
        // Add new head without removing tail
        newSnake = [newHead, ...snake];
        setScore(prevScore => prevScore + 1);
        
        // Increase speed
        const newSpeed = Math.max(MIN_SPEED, speed - SPEED_DECREASE_RATE);
        setSpeed(newSpeed);
      } else {
        // Add new head and remove tail
        newSnake = [newHead, ...snake.slice(0, -1)];
      }
      
      // Draw the updated game state
      if (canvasRef.current) {
        const newGameState = {
          snake: newSnake,
          food: foodEaten ? generateFood(newSnake) : food,
          grid,
          direction: nextDirection,
          nextDirection,
        };
        
        drawGame(canvasRef.current, newGameState);
        
        return newGameState;
      }
      
      return {
        snake: newSnake,
        food: foodEaten ? generateFood(newSnake) : food,
        grid,
        direction: nextDirection,
        nextDirection,
      };
    });
  };

  return {
    gameState,
    score,
    highScore,
    isGameOver,
    isPaused,
    startGame,
    resetGame,
    pauseGame,
    setDirection,
  };
};
