import { Frog, Vehicle, Log, Goal, Direction } from './types';
import { CELL_SIZE, COLS, ROWS, GOAL_POSITIONS, CANVAS_WIDTH } from './constants';

export function createFrog(): Frog {
  const startX = Math.floor(COLS / 2) * CELL_SIZE;
  const startY = (ROWS - 2) * CELL_SIZE;

  return {
    x: startX,
    y: startY,
    targetX: startX,
    targetY: startY,
    isMoving: false,
    direction: 'up',
    highestRow: ROWS - 2,
  };
}

export function moveFrog(frog: Frog, direction: Direction): Frog {
  let newX = frog.x;
  let newY = frog.y;

  switch (direction) {
    case 'up':
      newY = Math.max(0, frog.y - CELL_SIZE);
      break;
    case 'down':
      newY = Math.min((ROWS - 2) * CELL_SIZE, frog.y + CELL_SIZE);
      break;
    case 'left':
      newX = Math.max(0, frog.x - CELL_SIZE);
      break;
    case 'right':
      newX = Math.min((COLS - 1) * CELL_SIZE, frog.x + CELL_SIZE);
      break;
  }

  return {
    ...frog,
    targetX: newX,
    targetY: newY,
    isMoving: true,
    direction,
  };
}

export function updateFrogPosition(frog: Frog): Frog {
  if (!frog.isMoving) return frog;

  const speed = 8; // Pixels per frame for hop animation
  let newX = frog.x;
  let newY = frog.y;
  let isMoving = true;

  // Move towards target
  if (frog.x < frog.targetX) {
    newX = Math.min(frog.x + speed, frog.targetX);
  } else if (frog.x > frog.targetX) {
    newX = Math.max(frog.x - speed, frog.targetX);
  }

  if (frog.y < frog.targetY) {
    newY = Math.min(frog.y + speed, frog.targetY);
  } else if (frog.y > frog.targetY) {
    newY = Math.max(frog.y - speed, frog.targetY);
  }

  // Check if reached target
  if (newX === frog.targetX && newY === frog.targetY) {
    isMoving = false;
  }

  // Track highest row reached
  const currentRow = Math.floor(newY / CELL_SIZE);
  const highestRow = Math.min(frog.highestRow, currentRow);

  return {
    ...frog,
    x: newX,
    y: newY,
    isMoving,
    highestRow,
  };
}

export function createVehicles(level: number): Vehicle[] {
  const vehicles: Vehicle[] = [];
  const speedMultiplier = 1 + (level - 1) * 0.15;

  // Row 7 - Fast cars going right
  for (let i = 0; i < 2; i++) {
    vehicles.push({
      x: i * 200,
      y: 7 * CELL_SIZE,
      width: CELL_SIZE,
      speed: 1.2 * speedMultiplier,
      direction: 'right',
      type: 'car1',
    });
  }

  // Row 8 - Trucks going left
  for (let i = 0; i < 2; i++) {
    vehicles.push({
      x: i * 250 + 50,
      y: 8 * CELL_SIZE,
      width: CELL_SIZE * 2,
      speed: 0.8 * speedMultiplier,
      direction: 'left',
      type: 'truck',
    });
  }

  // Row 9 - Cars going right
  for (let i = 0; i < 2; i++) {
    vehicles.push({
      x: i * 200 + 20,
      y: 9 * CELL_SIZE,
      width: CELL_SIZE,
      speed: 1.0 * speedMultiplier,
      direction: 'right',
      type: 'car2',
    });
  }

  // Row 10 - Trucks going left
  for (let i = 0; i < 2; i++) {
    vehicles.push({
      x: i * 230 + 100,
      y: 10 * CELL_SIZE,
      width: CELL_SIZE * 2,
      speed: 0.9 * speedMultiplier,
      direction: 'left',
      type: 'truck',
    });
  }

  // Row 11 - Cars going right
  for (let i = 0; i < 3; i++) {
    vehicles.push({
      x: i * 160,
      y: 11 * CELL_SIZE,
      width: CELL_SIZE,
      speed: 0.8 * speedMultiplier,
      direction: 'right',
      type: 'car3',
    });
  }

  return vehicles;
}

export function updateVehicle(vehicle: Vehicle): Vehicle {
  let newX = vehicle.x;

  if (vehicle.direction === 'right') {
    newX += vehicle.speed;
    if (newX > CANVAS_WIDTH) {
      newX = -vehicle.width;
    }
  } else {
    newX -= vehicle.speed;
    if (newX + vehicle.width < 0) {
      newX = CANVAS_WIDTH;
    }
  }

  return { ...vehicle, x: newX };
}

export function createLogs(level: number): Log[] {
  const logs: Log[] = [];
  const speedMultiplier = 1 + (level - 1) * 0.1;

  // Row 1 - Long logs going right
  for (let i = 0; i < 2; i++) {
    logs.push({
      x: i * 250,
      y: 1 * CELL_SIZE,
      width: CELL_SIZE * 4,
      speed: 0.7 * speedMultiplier,
      direction: 'right',
      type: 'log',
    });
  }

  // Row 2 - Turtles going left
  for (let i = 0; i < 3; i++) {
    logs.push({
      x: i * 160,
      y: 2 * CELL_SIZE,
      width: CELL_SIZE * 3,
      speed: 0.6 * speedMultiplier,
      direction: 'left',
      type: 'turtle',
      turtleCount: 3,
    });
  }

  // Row 3 - Medium logs going right
  for (let i = 0; i < 3; i++) {
    logs.push({
      x: i * 180 + 30,
      y: 3 * CELL_SIZE,
      width: CELL_SIZE * 3,
      speed: 1.0 * speedMultiplier,
      direction: 'right',
      type: 'log',
    });
  }

  // Row 4 - Turtles going left
  for (let i = 0; i < 3; i++) {
    logs.push({
      x: i * 150 + 50,
      y: 4 * CELL_SIZE,
      width: CELL_SIZE * 2,
      speed: 0.7 * speedMultiplier,
      direction: 'left',
      type: 'turtle',
      turtleCount: 2,
    });
  }

  // Row 5 - Long logs going right
  for (let i = 0; i < 2; i++) {
    logs.push({
      x: i * 280,
      y: 5 * CELL_SIZE,
      width: CELL_SIZE * 5,
      speed: 0.8 * speedMultiplier,
      direction: 'right',
      type: 'log',
    });
  }

  return logs;
}

export function updateLog(log: Log): Log {
  let newX = log.x;

  if (log.direction === 'right') {
    newX += log.speed;
    if (newX > CANVAS_WIDTH) {
      newX = -log.width;
    }
  } else {
    newX -= log.speed;
    if (newX + log.width < 0) {
      newX = CANVAS_WIDTH;
    }
  }

  return { ...log, x: newX };
}

export function createGoals(): Goal[] {
  return GOAL_POSITIONS.map(col => ({
    x: col * CELL_SIZE,
    filled: false,
  }));
}

export function checkVehicleCollision(frog: Frog, vehicles: Vehicle[]): boolean {
  const frogBounds = {
    x: frog.x + 4,
    y: frog.y + 4,
    width: CELL_SIZE - 8,
    height: CELL_SIZE - 8,
  };

  for (const vehicle of vehicles) {
    const vehicleBounds = {
      x: vehicle.x + 2,
      y: vehicle.y + 4,
      width: vehicle.width - 4,
      height: CELL_SIZE - 8,
    };

    if (
      frogBounds.x < vehicleBounds.x + vehicleBounds.width &&
      frogBounds.x + frogBounds.width > vehicleBounds.x &&
      frogBounds.y < vehicleBounds.y + vehicleBounds.height &&
      frogBounds.y + frogBounds.height > vehicleBounds.y
    ) {
      return true;
    }
  }

  return false;
}

export function checkWaterCollision(frog: Frog, logs: Log[]): { inWater: boolean; onLog: Log | null } {
  const row = Math.floor(frog.y / CELL_SIZE);

  // Check if frog is in water rows (1-5)
  if (row < 1 || row > 5) {
    return { inWater: false, onLog: null };
  }

  const frogCenterX = frog.x + CELL_SIZE / 2;
  const frogCenterY = frog.y + CELL_SIZE / 2;

  // Check if on any log
  for (const log of logs) {
    if (
      frogCenterX >= log.x &&
      frogCenterX <= log.x + log.width &&
      frogCenterY >= log.y &&
      frogCenterY <= log.y + CELL_SIZE
    ) {
      return { inWater: false, onLog: log };
    }
  }

  // In water but not on log = drowning
  return { inWater: true, onLog: null };
}

export function checkGoalCollision(frog: Frog, goals: Goal[]): Goal | null {
  const row = Math.floor(frog.y / CELL_SIZE);

  if (row !== 0) return null;

  const frogCenterX = frog.x + CELL_SIZE / 2;

  for (const goal of goals) {
    if (
      !goal.filled &&
      frogCenterX >= goal.x &&
      frogCenterX <= goal.x + CELL_SIZE
    ) {
      return goal;
    }
  }

  // Hit barrier instead of goal
  return null;
}

export function checkOutOfBounds(frog: Frog): boolean {
  return frog.x < 0 || frog.x >= CANVAS_WIDTH || frog.y < 0;
}
