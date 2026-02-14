export interface Position {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameState = 'start' | 'playing' | 'paused' | 'gameover' | 'levelcomplete';

export type RowType = 'goal' | 'water' | 'road' | 'safe';

export interface Frog {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isMoving: boolean;
  direction: Direction;
  highestRow: number; // Track furthest progress for scoring
}

export interface Vehicle {
  x: number;
  y: number;
  width: number;
  speed: number;
  direction: 'left' | 'right';
  type: 'car1' | 'car2' | 'car3' | 'truck';
}

export interface Log {
  x: number;
  y: number;
  width: number;
  speed: number;
  direction: 'left' | 'right';
  type: 'log' | 'turtle';
  turtleCount?: number; // Number of turtles in group
}

export interface Goal {
  x: number;
  filled: boolean;
}

export interface GameData {
  state: GameState;
  frog: Frog;
  vehicles: Vehicle[];
  logs: Log[];
  goals: Goal[];
  score: number;
  lives: number;
  level: number;
  timeRemaining: number;
  highScore: number;
}
