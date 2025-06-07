import { GameState } from '../types/game';

// Colors and sizes
const CELL_SIZE = 20;
const SNAKE_COLOR = '#FFA07A';  // Light salmon color for base
const SNAKE_HEAD_COLOR = '#FF6B6B'; // Pinkish red for head
const BORDER_COLOR = '#4B0082';  // Indigo for the border

// Vein colors for different levels
const VEIN_COLORS = [
  '#CD5C5C', // Level 1-9
  '#DC143C', // Level 10-19
  '#B22222', // Level 20-29
  '#8B0000', // Level 30-39
  '#800000', // Level 40-49
  '#660000', // Level 50+
];

export const drawGame = (canvas: HTMLCanvasElement, gameState: GameState) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { snake, food, grid } = gameState;
  
  const cellWidth = canvas.width / grid.width;
  const cellHeight = canvas.height / grid.height;
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw border
  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
  // Draw food - emoji based on level
  const foodX = food.x * cellWidth;
  const foodY = food.y * cellHeight;
  const foodSize = Math.min(cellWidth, cellHeight);
  
  ctx.font = `${foodSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Select emoji based on level
  let emoji = '👱‍♀️';
  if (snake.length >= 80) {
    emoji = '👩‍🦽';
  } else if (snake.length >= 50) {
    emoji = '🤰';
  } else if (snake.length >= 25) {
    emoji = '👩';
  }
  
  ctx.fillText(emoji, foodX + foodSize/2, foodY + foodSize/2);
  
  // Draw snake body
  snake.forEach((segment, index) => {
    const segX = segment.x * cellWidth;
    const segY = segment.y * cellHeight;
    
    if (index === 0) {
      // Head
      ctx.fillStyle = SNAKE_HEAD_COLOR;
      
      // Draw a rounded rectangle for the head
      const radius = cellWidth / 4;
      ctx.beginPath();
      ctx.moveTo(segX + radius, segY);
      ctx.arcTo(segX + cellWidth, segY, segX + cellWidth, segY + cellHeight, radius);
      ctx.arcTo(segX + cellWidth, segY + cellHeight, segX, segY + cellHeight, radius);
      ctx.arcTo(segX, segY + cellHeight, segX, segY, radius);
      ctx.arcTo(segX, segY, segX + cellWidth, segY, radius);
      ctx.fill();
      
    } else {
      // Body segments with veins
      ctx.fillStyle = SNAKE_COLOR;
      
      // Draw base segment
      const radius = cellWidth / 6;
      ctx.beginPath();
      ctx.moveTo(segX + radius, segY);
      ctx.arcTo(segX + cellWidth, segY, segX + cellWidth, segY + cellHeight, radius);
      ctx.arcTo(segX + cellWidth, segY + cellHeight, segX, segY + cellHeight, radius);
      ctx.arcTo(segX, segY + cellHeight, segX, segY, radius);
      ctx.arcTo(segX, segY, segX + cellWidth, segY, radius);
      ctx.fill();
      
      // Add veins based on snake length (level)
      const veinLevel = Math.min(Math.floor(snake.length / 10), VEIN_COLORS.length - 1);
      ctx.strokeStyle = VEIN_COLORS[veinLevel];
      ctx.lineWidth = 2;
      
      // Draw veins
      const veinCount = Math.min(Math.floor(snake.length / 5), 5);
      for (let i = 0; i < veinCount; i++) {
        ctx.beginPath();
        const startX = segX + (cellWidth * 0.2) + (Math.random() * cellWidth * 0.6);
        const startY = segY;
        const endX = startX + (Math.random() * cellWidth * 0.4 - cellWidth * 0.2);
        const endY = segY + cellHeight;
        
        // Create curved vein
        const controlX = startX + (Math.random() * cellWidth * 0.4 - cellWidth * 0.2);
        const controlY = segY + cellHeight / 2;
        
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
      }
    }
  });
};
