import { TokenGate } from '@apps.fun/sdk';
import { PublicKey } from '@solana/web3.js';

let gate: TokenGate | null = null;

export function isTokenGateConfigured(): boolean {
  const tokenMint = process.env.NEXT_PUBLIC_TOKEN_MINT;
  return !!tokenMint;
}

function getGate(): TokenGate {
  if (!gate) {
    const tokenMint = process.env.NEXT_PUBLIC_TOKEN_MINT;
    if (!tokenMint) {
      // We intentionally avoid throwing here so the app can be deployed UI-first.
      // The UI should treat this as "not configured" and show a banner.
      throw new Error('Token gate not configured (missing NEXT_PUBLIC_TOKEN_MINT)');
    }
    gate = new TokenGate({
      tokenMint: new PublicKey(tokenMint),
      minAmount: BigInt(process.env.NEXT_PUBLIC_MIN_TOKENS || '1000000'),
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
    });
  }
  return gate;
}

export async function checkAccess(wallet: string) {
  if (!isTokenGateConfigured()) {
    return {
      configured: false,
      allowed: true,
      balance: BigInt(0),
      required: BigInt(0),
    };
  }

  return {
    configured: true,
    ...(await getGate().check(wallet)),
  };
}
