// Canvas dimensions
export const CANVAS_WIDTH = 448;
export const CANVAS_HEIGHT = 512;

// Grid dimensions
export const CELL_SIZE = 32;
export const COLS = 14;
export const ROWS = 16;

// Colors - Classic arcade palette
export const COLORS = {
  background: '#000000',
  grass: '#228B22',
  road: '#333333',
  water: '#000080',
  roadLine: '#FFFF00',

  // Frog colors
  frogBody: '#32CD32',
  frogEye: '#FFFFFF',
  frogPupil: '#000000',

  // Vehicle colors
  car1: '#FF0000',
  car2: '#FFFF00',
  car3: '#00FFFF',
  truck: '#FF00FF',

  // Log colors
  log: '#8B4513',
  logDark: '#654321',

  // Turtle colors
  turtle: '#006400',
  turtleShell: '#228B22',

  // Lily pad
  lilyPad: '#006400',
  lilyPadLight: '#228B22',

  // UI colors
  text: '#FFFFFF',
  score: '#FFFF00',
  lives: '#FF0000',
  timeBar: '#00FF00',
  timeBarLow: '#FF0000',
};

// Game timing
export const GAME_TIME = 30000; // 30 seconds per level
export const MOVE_COOLDOWN = 150; // ms between moves

// Speeds (pixels per frame at 60fps)
export const SPEEDS = {
  car1: 2,
  car2: 2.5,
  car3: 3,
  truck: 1.5,
  log: 1,
  logFast: 1.5,
  turtle: 0.8,
};

// Row layout (0 = top)
export const ROW_TYPES = {
  0: 'goal',      // Home/goal row
  1: 'water',     // Water with logs
  2: 'water',     // Water with turtles
  3: 'water',     // Water with logs
  4: 'water',     // Water with turtles
  5: 'water',     // Water with logs
  6: 'safe',      // Middle safe zone
  7: 'road',      // Road with cars
  8: 'road',      // Road with trucks
  9: 'road',      // Road with cars
  10: 'road',     // Road with trucks
  11: 'road',     // Road with cars
  12: 'safe',     // Starting safe zone
  13: 'safe',     // Extra row for start
};

// Scoring
export const POINTS = {
  forwardMove: 10,
  reachHome: 50,
  timeBonus: 10, // per second remaining
  levelComplete: 1000,
};

// Lives
export const STARTING_LIVES = 3;
export const MAX_LIVES = 3;

// Goal positions (5 lily pads)
export const GOAL_POSITIONS = [1, 4, 7, 10, 13]; // column positions
