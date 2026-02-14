'use client';

import { useEffect, useRef, useCallback } from 'react';
import { GameEngine } from '@/lib/game/GameEngine';
import { render } from '@/lib/game/renderer';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/game/constants';
import { Direction, GameData } from '@/lib/game/types';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const handleUpdate = useCallback((data: GameData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Disable image smoothing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;

    render(ctx, data);
  }, []);

  useEffect(() => {
    // Initialize game engine
    engineRef.current = new GameEngine(handleUpdate);

    // Initial render
    handleUpdate(engineRef.current.getState());

    // Keyboard input handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      const keyMap: Record<string, Direction | 'space'> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        KeyW: 'up',
        KeyS: 'down',
        KeyA: 'left',
        KeyD: 'right',
        Space: 'space',
      };

      const action = keyMap[e.code];

      if (action) {
        e.preventDefault();

        if (action === 'space') {
          engineRef.current.start();
        } else {
          engineRef.current.handleInput(action);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, [handleUpdate]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-green-700 rounded"
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
