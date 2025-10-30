/**
 * Stacks Wallet Generation & Management
 * Clean implementation using @stacks/wallet-sdk
 * For TipSats - Bitcoin tipping on Stacks
 */

import { generateWallet, getStxAddress, Wallet } from "@stacks/wallet-sdk";
import { encryptMnemonic, decryptMnemonic } from "@stacks/encryption";
import { publicKeyFromPrivate } from "@stacks/transactions";
import * as bip39 from "bip39";
import crypto from "crypto";

/**
 * Generate a new Stacks wallet deterministically from user ID
 * Uses user ID as entropy source for reproducibility
 */
export async function generateStacksWallet(userId: string): Promise<{
  address: string;
  publicKey: string;
  encryptedMnemonic: string;
}> {
  // Generate deterministic entropy from userId
  const entropy = generateDeterministicEntropy(userId);

  // Convert entropy to BIP39 mnemonic (24 words for 256-bit entropy)
  const mnemonic = bip39.entropyToMnemonic(entropy);

  // Generate password for encryption
  const password = generateDeterministicPassword(userId);

  const wallet = await generateWallet({
    secretKey: mnemonic,
    password,
  });

  // Get the first account (index 0)
  const account = wallet.accounts[0];

  // Get Stacks address from account
  const address = getStxAddress({ account });

  // Derive public key from private key
  const publicKey = publicKeyFromPrivate(account.stxPrivateKey);

  // Encrypt the mnemonic for storage
  const encryptedMnemonic = await encryptMnemonic(mnemonic, password);
  const encryptedMnemonicHex = Buffer.from(encryptedMnemonic).toString("hex");

  return {
    address,
    publicKey,
    encryptedMnemonic: encryptedMnemonicHex,
  };
}

/**
 * Restore wallet from encrypted mnemonic
 * Used for signing transactions
 */
export async function restoreStacksWallet(
  encryptedMnemonicHex: string,
  userId: string
): Promise<Wallet> {
  const password = generateDeterministicPassword(userId);
  const encryptedMnemonic = Buffer.from(encryptedMnemonicHex, "hex");

  const mnemonic = await decryptMnemonic(encryptedMnemonic, password);

  const wallet = await generateWallet({
    secretKey: mnemonic,
    password,
  });

  return wallet;
}

/**
 * Generate deterministic entropy from userId
 * Creates 256 bits (32 bytes) of entropy for 24-word mnemonic
 */
function generateDeterministicEntropy(userId: string): Buffer {
  const appSalt = process.env.WALLET_ENCRYPTION_SALT || "tipsats-stacks-v1";
  const combined = `${appSalt}-${userId}-entropy`;

  // Generate 32 bytes (256 bits) for 24-word mnemonic
  return crypto.createHash("sha256").update(combined).digest();
}

/**
 * Generate deterministic password from userId
 * Adds app-specific salt for security
 */
function generateDeterministicPassword(userId: string): string {
  const appSalt = process.env.WALLET_ENCRYPTION_SALT || "tipsats-stacks-v1";
  const combined = `${appSalt}-${userId}-password`;

  // Generate a 64-character hex string
  return crypto.createHash("sha256").update(combined).digest("hex");
}

/**
 * Verify a Stacks address is valid
 */
export function isValidStacksAddress(address: string): boolean {
  // Stacks mainnet addresses start with SP, testnet with ST
  return /^(SP|ST)[0-9A-Z]{38,41}$/.test(address);
}
