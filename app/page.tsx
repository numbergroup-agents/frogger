'use client';

import Game from '@/components/Game';
import { TokenGate } from '@/components/TokenGate';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-green-500 mb-4 tracking-wider">
        FROGGER
      </h1>
      <TokenGate>
        <Game />
        <div className="mt-4 text-gray-400 text-sm text-center">
          <p>Use Arrow Keys to move</p>
          <p className="mt-1">Press SPACE to start/pause</p>
        </div>
      </TokenGate>
    </main>
  );
}
