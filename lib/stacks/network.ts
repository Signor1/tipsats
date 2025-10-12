/**
 * Stacks Network Configuration
 * Configures testnet/mainnet for sBTC transactions
 */

import { StacksNetwork } from "@stacks/network";

// Determine network from environment
const isMainnet = process.env.NEXT_PUBLIC_STACKS_NETWORK === "mainnet";

// Create Stacks network configuration
export const stacksNetwork: StacksNetwork = {
  version: isMainnet ? 1 : 0,
  chainId: isMainnet ? 1 : 2147483648,
  coreApiUrl: isMainnet
    ? "https://api.mainnet.hiro.so"
    : "https://api.testnet.hiro.so",
  broadcastEndpoint: "/v2/transactions",
  transferFeeEstimateEndpoint: "/v2/fees/transfer",
  accountEndpoint: "/v2/accounts",
  contractAbiEndpoint: "/v2/contracts/interface",
  readOnlyFunctionCallEndpoint: "/v2/contracts/call-read",
  isMainnet: () => isMainnet,
  getBurnAddress: () => (isMainnet ? "SP000000000000000000002Q6VF78" : "ST000000000000000000002AMW42H"),
};

// Stacks Explorer URLs
export const EXPLORER_URL = isMainnet
  ? "https://explorer.stacks.co"
  : "https://explorer.stacks.co/?chain=testnet";

// API URLs
export const API_URL = isMainnet
  ? "https://api.mainnet.hiro.so"
  : "https://api.testnet.hiro.so";

// Network helper functions
export function getExplorerTxUrl(txId: string): string {
  return `${EXPLORER_URL}/txid/${txId}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}`;
}

// Convert USD to microSTX (for display purposes)
// Note: In production, fetch real-time BTC/USD price
export function usdToMicroSTX(usdAmount: number): bigint {
  // Mock conversion: 1 STX = $0.50 USD (hardcoded for demo)
  const stxPrice = 0.5;
  const stxAmount = usdAmount / stxPrice;
  const microSTX = stxAmount * 1_000_000; // 1 STX = 1,000,000 microSTX

  return BigInt(Math.floor(microSTX));
}

// Convert microSTX to USD
export function microSTXToUSD(microSTX: bigint): number {
  const stxPrice = 0.5;
  const stxAmount = Number(microSTX) / 1_000_000;
  return stxAmount * stxPrice;
}

// Format STX amount for display
export function formatSTX(microSTX: bigint): string {
  const stx = Number(microSTX) / 1_000_000;
  return stx.toFixed(6);
}
