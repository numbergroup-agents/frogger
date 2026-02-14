import { GameData, Frog, Vehicle, Log, Goal } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CELL_SIZE,
  COLS,
  ROWS,
  COLORS,
  GAME_TIME,
} from './constants';

export function render(ctx: CanvasRenderingContext2D, data: GameData): void {
  // Clear canvas
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw background rows
  drawBackground(ctx);

  // Draw goals
  data.goals.forEach(goal => drawGoal(ctx, goal));

  // Draw logs and turtles
  data.logs.forEach(log => drawLog(ctx, log));

  // Draw vehicles
  data.vehicles.forEach(vehicle => drawVehicle(ctx, vehicle));

  // Draw frog
  drawFrog(ctx, data.frog);

  // Draw HUD
  drawHUD(ctx, data);

  // Draw overlays
  if (data.state === 'start') {
    drawStartScreen(ctx, data);
  } else if (data.state === 'paused') {
    drawPausedScreen(ctx);
  } else if (data.state === 'gameover') {
    drawGameOverScreen(ctx, data);
  } else if (data.state === 'levelcomplete') {
    drawLevelCompleteScreen(ctx, data);
  }
}

function drawBackground(ctx: CanvasRenderingContext2D): void {
  // Goal row (row 0)
  ctx.fillStyle = COLORS.water;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CELL_SIZE);

  // Water section (rows 1-5)
  ctx.fillStyle = COLORS.water;
  ctx.fillRect(0, CELL_SIZE, CANVAS_WIDTH, CELL_SIZE * 5);

  // Middle safe zone (row 6)
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, CELL_SIZE * 6, CANVAS_WIDTH, CELL_SIZE);

  // Road section (rows 7-11)
  ctx.fillStyle = COLORS.road;
  ctx.fillRect(0, CELL_SIZE * 7, CANVAS_WIDTH, CELL_SIZE * 5);

  // Road markings
  ctx.fillStyle = COLORS.roadLine;
  for (let row = 7; row < 12; row++) {
    for (let col = 0; col < COLS; col += 2) {
      ctx.fillRect(col * CELL_SIZE + 8, row * CELL_SIZE + CELL_SIZE - 4, CELL_SIZE - 16, 2);
    }
  }

  // Starting safe zone (rows 12-13)
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, CELL_SIZE * 12, CANVAS_WIDTH, CELL_SIZE * 2);

  // HUD area (rows 14-15)
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, CELL_SIZE * 14, CANVAS_WIDTH, CELL_SIZE * 2);
}

function drawFrog(ctx: CanvasRenderingContext2D, frog: Frog): void {
  const x = frog.x;
  const y = frog.y;
  const size = CELL_SIZE;

  // Body
  ctx.fillStyle = COLORS.frogBody;

  // Main body (rounded rectangle approximation)
  ctx.fillRect(x + 4, y + 8, size - 8, size - 12);

  // Head
  ctx.fillRect(x + 8, y + 4, size - 16, 8);

  // Legs based on direction
  if (frog.direction === 'up' || frog.direction === 'down') {
    // Back legs
    ctx.fillRect(x + 2, y + size - 10, 6, 8);
    ctx.fillRect(x + size - 8, y + size - 10, 6, 8);
    // Front legs
    ctx.fillRect(x + 2, y + 6, 6, 8);
    ctx.fillRect(x + size - 8, y + 6, 6, 8);
  } else {
    // Side view legs
    ctx.fillRect(x + 6, y + 2, 8, 6);
    ctx.fillRect(x + 6, y + size - 8, 8, 6);
    ctx.fillRect(x + size - 14, y + 2, 8, 6);
    ctx.fillRect(x + size - 14, y + size - 8, 8, 6);
  }

  // Eyes
  ctx.fillStyle = COLORS.frogEye;
  ctx.fillRect(x + 8, y + 6, 4, 4);
  ctx.fillRect(x + size - 12, y + 6, 4, 4);

  // Pupils
  ctx.fillStyle = COLORS.frogPupil;
  ctx.fillRect(x + 9, y + 7, 2, 2);
  ctx.fillRect(x + size - 11, y + 7, 2, 2);
}

function drawVehicle(ctx: CanvasRenderingContext2D, vehicle: Vehicle): void {
  const x = vehicle.x;
  const y = vehicle.y;
  const width = vehicle.width;
  const height = CELL_SIZE - 8;

  // Vehicle color based on type
  const colors: Record<string, string> = {
    car1: COLORS.car1,
    car2: COLORS.car2,
    car3: COLORS.car3,
    truck: COLORS.truck,
  };

  ctx.fillStyle = colors[vehicle.type] || COLORS.car1;

  // Main body
  ctx.fillRect(x + 2, y + 6, width - 4, height);

  // Cab/top (darker shade)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  if (vehicle.type === 'truck') {
    ctx.fillRect(x + 4, y + 8, width * 0.25, height - 4);
  } else {
    ctx.fillRect(x + width * 0.3, y + 8, width * 0.4, height - 4);
  }

  // Wheels
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 6, y + 4, 6, 4);
  ctx.fillRect(x + width - 12, y + 4, 6, 4);
  ctx.fillRect(x + 6, y + height + 4, 6, 4);
  ctx.fillRect(x + width - 12, y + height + 4, 6, 4);

  // Headlights
  ctx.fillStyle = '#FFFF00';
  if (vehicle.direction === 'right') {
    ctx.fillRect(x + width - 4, y + 10, 3, 4);
    ctx.fillRect(x + width - 4, y + height, 3, 4);
  } else {
    ctx.fillRect(x + 1, y + 10, 3, 4);
    ctx.fillRect(x + 1, y + height, 3, 4);
  }
}

function drawLog(ctx: CanvasRenderingContext2D, log: Log): void {
  const x = log.x;
  const y = log.y;
  const width = log.width;
  const height = CELL_SIZE - 4;

  if (log.type === 'log') {
    // Log body
    ctx.fillStyle = COLORS.log;
    ctx.fillRect(x, y + 4, width, height);

    // Log texture (bark lines)
    ctx.fillStyle = COLORS.logDark;
    for (let i = 0; i < width; i += 16) {
      ctx.fillRect(x + i + 4, y + 6, 2, height - 4);
    }

    // Log ends
    ctx.fillStyle = COLORS.logDark;
    ctx.fillRect(x, y + 4, 4, height);
    ctx.fillRect(x + width - 4, y + 4, 4, height);
  } else {
    // Turtles
    const turtleCount = log.turtleCount || 3;
    const turtleWidth = width / turtleCount;

    for (let i = 0; i < turtleCount; i++) {
      const tx = x + i * turtleWidth;

      // Shell
      ctx.fillStyle = COLORS.turtleShell;
      ctx.beginPath();
      ctx.arc(tx + turtleWidth / 2, y + CELL_SIZE / 2, turtleWidth / 2 - 4, 0, Math.PI * 2);
      ctx.fill();

      // Shell pattern
      ctx.fillStyle = COLORS.turtle;
      ctx.beginPath();
      ctx.arc(tx + turtleWidth / 2, y + CELL_SIZE / 2, turtleWidth / 2 - 8, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = COLORS.turtle;
      ctx.fillRect(tx + turtleWidth / 2 - 3, y + 4, 6, 8);

      // Flippers
      ctx.fillRect(tx + 4, y + CELL_SIZE / 2 - 2, 6, 4);
      ctx.fillRect(tx + turtleWidth - 10, y + CELL_SIZE / 2 - 2, 6, 4);
    }
  }
}

function drawGoal(ctx: CanvasRenderingContext2D, goal: Goal): void {
  const x = goal.x;
  const y = 0;

  // Lily pad
  ctx.fillStyle = goal.filled ? COLORS.frogBody : COLORS.lilyPad;
  ctx.beginPath();
  ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2 - 4, 0, Math.PI * 2);
  ctx.fill();

  // Lily pad highlight
  ctx.fillStyle = goal.filled ? COLORS.frogBody : COLORS.lilyPadLight;
  ctx.beginPath();
  ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2 - 8, 0, Math.PI * 2);
  ctx.fill();

  if (goal.filled) {
    // Draw small frog icon
    ctx.fillStyle = COLORS.frogBody;
    ctx.fillRect(x + 10, y + 8, 12, 16);
    ctx.fillStyle = COLORS.frogEye;
    ctx.fillRect(x + 11, y + 10, 3, 3);
    ctx.fillRect(x + 18, y + 10, 3, 3);
  }
}

function drawHUD(ctx: CanvasRenderingContext2D, data: GameData): void {
  const hudY = CELL_SIZE * 14;

  // Score
  ctx.fillStyle = COLORS.text;
  ctx.font = '12px monospace';
  ctx.fillText(`SCORE: ${data.score}`, 10, hudY + 16);

  // High score
  ctx.fillText(`HI: ${data.highScore}`, CANVAS_WIDTH - 100, hudY + 16);

  // Level
  ctx.fillText(`LVL: ${data.level}`, CANVAS_WIDTH / 2 - 25, hudY + 16);

  // Lives (frog icons)
  ctx.fillStyle = COLORS.frogBody;
  for (let i = 0; i < data.lives; i++) {
    ctx.fillRect(10 + i * 20, hudY + 28, 12, 12);
  }

  // Time bar
  const timeBarWidth = CANVAS_WIDTH - 100;
  const timePercent = data.timeRemaining / GAME_TIME;
  const barX = 50;
  const barY = hudY + 40;

  ctx.fillStyle = '#333333';
  ctx.fillRect(barX, barY, timeBarWidth, 8);

  ctx.fillStyle = timePercent < 0.25 ? COLORS.timeBarLow : COLORS.timeBar;
  ctx.fillRect(barX, barY, timeBarWidth * timePercent, 8);

  ctx.fillStyle = COLORS.text;
  ctx.fillText('TIME', 10, barY + 8);
}

function drawStartScreen(ctx: CanvasRenderingContext2D, data: GameData): void {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Title
  ctx.fillStyle = COLORS.frogBody;
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FROGGER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);

  // Instructions
  ctx.fillStyle = COLORS.text;
  ctx.font = '14px monospace';
  ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  ctx.fillText('Use Arrow Keys to Move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);

  // High score
  if (data.highScore > 0) {
    ctx.fillStyle = COLORS.score;
    ctx.fillText(`High Score: ${data.highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
  }

  ctx.textAlign = 'left';
}

function drawPausedScreen(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.score;
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

  ctx.fillStyle = COLORS.text;
  ctx.font = '14px monospace';
  ctx.fillText('Press SPACE to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);

  ctx.textAlign = 'left';
}

function drawGameOverScreen(ctx: CanvasRenderingContext2D, data: GameData): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.lives;
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);

  ctx.fillStyle = COLORS.text;
  ctx.font = '16px monospace';
  ctx.fillText(`Final Score: ${data.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

  if (data.score >= data.highScore && data.score > 0) {
    ctx.fillStyle = COLORS.score;
    ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  }

  ctx.fillStyle = COLORS.text;
  ctx.font = '14px monospace';
  ctx.fillText('Press SPACE to Play Again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);

  ctx.textAlign = 'left';
}

function drawLevelCompleteScreen(ctx: CanvasRenderingContext2D, data: GameData): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.frogBody;
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL COMPLETE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);

  ctx.fillStyle = COLORS.score;
  ctx.font = '18px monospace';
  ctx.fillText(`Score: ${data.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

  ctx.fillStyle = COLORS.text;
  ctx.font = '14px monospace';
  ctx.fillText(`Next Level: ${data.level + 1}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  ctx.fillText('Press SPACE to Continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);

  ctx.textAlign = 'left';
}
