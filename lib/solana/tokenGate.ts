import { TokenGate } from '@apps.fun/sdk';
import { PublicKey } from '@solana/web3.js';

let gate: TokenGate | null = null;

function getGate(): TokenGate {
  if (!gate) {
    const tokenMint = process.env.NEXT_PUBLIC_TOKEN_MINT;
    if (!tokenMint) {
      throw new Error('NEXT_PUBLIC_TOKEN_MINT environment variable is required');
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
  return getGate().check(wallet);
}
