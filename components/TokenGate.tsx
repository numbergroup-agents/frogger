'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { checkAccess, isTokenGateConfigured } from '@/lib/solana/tokenGate';

interface Props {
  children: ReactNode;
}

interface GateResult {
  configured?: boolean;
  allowed: boolean;
  balance: bigint;
  required: bigint;
}

export const TokenGate: FC<Props> = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [gateResult, setGateResult] = useState<GateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!connected || !publicKey) {
      setGateResult(null);
      setError(null);
      return;
    }

    const check = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await checkAccess(publicKey.toBase58());
        setGateResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check token balance');
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [connected, publicKey]);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const configured = isTokenGateConfigured();

  if (!configured) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 w-full max-w-xl">
        <div className="bg-yellow-900/40 border border-yellow-600 text-yellow-200 p-4 rounded-xl w-full">
          <p className="font-semibold">Token gate not configured</p>
          <p className="text-sm opacity-90">
            Missing <code className="font-mono">NEXT_PUBLIC_TOKEN_MINT</code>. Deploy is UI-first; gating will
            activate once the token mint is set.
          </p>
        </div>

        {/* Allow UI-first experience even without gating */}
        {children}

        {!connected && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-gray-400 text-center">(Optional) Connect your wallet</p>
            <WalletMultiButton />
          </div>
        )}
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <h2 className="text-xl font-bold text-green-500">Token Required</h2>
        <p className="text-gray-400 text-center max-w-md">
          Connect your wallet to access Frogger. You need to hold the required tokens to play.
        </p>
        <WalletMultiButton />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="text-gray-400">Checking token balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-xl font-bold text-red-500">Error</h2>
        <p className="text-gray-400 text-center">{error}</p>
        <WalletMultiButton />
      </div>
    );
  }

  if (gateResult && !gateResult.allowed) {
    const needed = gateResult.required - gateResult.balance;
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-xl font-bold text-yellow-500">Insufficient Tokens</h2>
        <p className="text-gray-400 text-center">
          You need {needed.toString()} more tokens to play Frogger.
        </p>
        <p className="text-gray-500 text-sm">
          Current balance: {gateResult.balance.toString()} / {gateResult.required.toString()} required
        </p>
        <WalletMultiButton />
      </div>
    );
  }

  return <>{children}</>;
};
