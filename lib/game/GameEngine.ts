import { GameData, GameState, Direction } from './types';
import {
  createFrog,
  moveFrog,
  updateFrogPosition,
  createVehicles,
  updateVehicle,
  createLogs,
  updateLog,
  createGoals,
  checkVehicleCollision,
  checkWaterCollision,
  checkGoalCollision,
  checkOutOfBounds,
} from './entities';
import {
  GAME_TIME,
  MOVE_COOLDOWN,
  POINTS,
  STARTING_LIVES,
  MAX_LIVES,
  ROWS,
  CELL_SIZE,
} from './constants';

export class GameEngine {
  private data: GameData;
  private lastMoveTime: number = 0;
  private gameStartTime: number = 0;
  private animationFrameId: number | null = null;
  private onUpdate: (data: GameData) => void;

  constructor(onUpdate: (data: GameData) => void) {
    this.onUpdate = onUpdate;
    this.data = this.createInitialState();
    // Defer high score loading to avoid hydration mismatch
    setTimeout(() => {
      const savedHighScore = this.loadHighScore();
      if (savedHighScore > this.data.highScore) {
        this.data.highScore = savedHighScore;
        this.onUpdate(this.data);
      }
    }, 0);
  }

  private createInitialState(): GameData {
    return {
      state: 'start',
      frog: createFrog(),
      vehicles: createVehicles(1),
      logs: createLogs(1),
      goals: createGoals(),
      score: 0,
      lives: STARTING_LIVES,
      level: 1,
      timeRemaining: GAME_TIME,
      highScore: 0,
    };
  }

  private loadHighScore(): number {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('frogger_highscore');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  }

  private saveHighScore(score: number): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('frogger_highscore', score.toString());
    }
  }

  start(): void {
    if (this.data.state === 'start' || this.data.state === 'gameover') {
      this.data = this.createInitialState();
      this.data.state = 'playing';
      this.gameStartTime = Date.now();
      this.data.timeRemaining = GAME_TIME;
    } else if (this.data.state === 'paused') {
      this.data.state = 'playing';
    } else if (this.data.state === 'playing') {
      this.data.state = 'paused';
    } else if (this.data.state === 'levelcomplete') {
      this.nextLevel();
    }

    if (this.animationFrameId === null) {
      this.gameLoop();
    }

    this.onUpdate(this.data);
  }

  private nextLevel(): void {
    const newLevel = this.data.level + 1;
    const newLives = Math.min(this.data.lives + 1, MAX_LIVES);
    this.data = {
      ...this.data,
      state: 'playing',
      frog: createFrog(),
      vehicles: createVehicles(newLevel),
      logs: createLogs(newLevel),
      goals: createGoals(),
      level: newLevel,
      lives: newLives,
      timeRemaining: GAME_TIME,
    };
    this.gameStartTime = Date.now();
  }

  handleInput(direction: Direction): void {
    if (this.data.state !== 'playing') return;
    if (this.data.frog.isMoving) return;

    const now = Date.now();
    if (now - this.lastMoveTime < MOVE_COOLDOWN) return;

    const previousRow = Math.floor(this.data.frog.y / CELL_SIZE);
    this.data.frog = moveFrog(this.data.frog, direction);
    const newRow = Math.floor(this.data.frog.targetY / CELL_SIZE);

    // Score for forward movement
    if (direction === 'up' && newRow < previousRow && newRow < this.data.frog.highestRow) {
      this.data.score += POINTS.forwardMove;
    }

    this.lastMoveTime = now;
    this.onUpdate(this.data);
  }

  private gameLoop = (): void => {
    if (this.data.state === 'playing') {
      this.update();
    }

    this.onUpdate(this.data);
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(): void {
    // Update frog animation
    this.data.frog = updateFrogPosition(this.data.frog);

    // Update vehicles
    this.data.vehicles = this.data.vehicles.map(updateVehicle);

    // Update logs
    this.data.logs = this.data.logs.map(updateLog);

    // Check vehicle collision (can happen mid-hop)
    if (checkVehicleCollision(this.data.frog, this.data.vehicles)) {
      this.loseLife();
      return;
    }

    // Check out of bounds (can happen when riding logs)
    if (checkOutOfBounds(this.data.frog)) {
      this.loseLife();
      return;
    }

    // Only check water collision when frog has landed
    if (!this.data.frog.isMoving) {
      const { inWater, onLog } = checkWaterCollision(this.data.frog, this.data.logs);

      if (onLog) {
        // Ride on log
        this.data.frog = {
          ...this.data.frog,
          x: this.data.frog.x + (onLog.direction === 'right' ? onLog.speed : -onLog.speed),
          targetX: this.data.frog.targetX + (onLog.direction === 'right' ? onLog.speed : -onLog.speed),
        };
      } else if (inWater) {
        // In water but not on a log = drowning
        this.loseLife();
        return;
      }
    }

    // Check goal reached
    if (!this.data.frog.isMoving) {
      const goal = checkGoalCollision(this.data.frog, this.data.goals);
      if (goal) {
        this.reachGoal(goal);
      } else if (Math.floor(this.data.frog.y / CELL_SIZE) === 0) {
        // Hit barrier at top
        this.loseLife();
      }
    }

    // Update time
    const elapsed = Date.now() - this.gameStartTime;
    this.data.timeRemaining = Math.max(0, GAME_TIME - elapsed);

    if (this.data.timeRemaining <= 0) {
      this.loseLife();
    }
  }

  private loseLife(): void {
    this.data.lives--;

    if (this.data.lives <= 0) {
      this.data.state = 'gameover';
      if (this.data.score > this.data.highScore) {
        this.data.highScore = this.data.score;
        this.saveHighScore(this.data.score);
      }
    } else {
      // Reset frog position
      this.data.frog = createFrog();
      this.gameStartTime = Date.now();
      this.data.timeRemaining = GAME_TIME;
    }

    this.onUpdate(this.data);
  }

  private reachGoal(goal: { x: number; filled: boolean }): void {
    // Add score
    const timeBonus = Math.floor(this.data.timeRemaining / 1000) * POINTS.timeBonus;
    this.data.score += POINTS.reachHome + POINTS.levelComplete + timeBonus;

    // Advance to next level and grant bonus life (up to max)
    this.data.state = 'levelcomplete';

    if (this.data.score > this.data.highScore) {
      this.data.highScore = this.data.score;
      this.saveHighScore(this.data.score);
    }

    this.onUpdate(this.data);
  }

  getState(): GameData {
    return this.data;
  }

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
