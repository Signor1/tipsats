/**
 * Turnkey SDK Client Configuration
 * Production implementation for Stacks Builders Challenge hackathon
 * Handles embedded wallet creation and transaction signing for TipSats
 */

import { Turnkey } from "@turnkey/sdk-server";
import { createActivityPoller } from "@turnkey/http";

// Initialize Turnkey Server SDK
export function getTurnkeyClient() {
  const apiBaseUrl = process.env.TURNKEY_BASE_URL || "https://api.turnkey.com";
  const apiPrivateKey = process.env.TURNKEY_API_PRIVATE_KEY;
  const apiPublicKey = process.env.TURNKEY_API_PUBLIC_KEY;
  const defaultOrganizationId = process.env.TURNKEY_ORGANIZATION_ID || "a682ebea-5a0e-4bac-8ae6-84d07acd4534";

  if (!apiPrivateKey || !apiPublicKey) {
    throw new Error("Turnkey API credentials not configured. Please set TURNKEY_API_PRIVATE_KEY and TURNKEY_API_PUBLIC_KEY in environment variables.");
  }

  const client = new Turnkey({
    apiBaseUrl,
    apiPrivateKey,
    apiPublicKey,
    defaultOrganizationId,
  });

  return client;
}

// Wallet creation interface
export interface CreateWalletParams {
  walletName: string;
  userId: string;
}

export interface TurnkeyWallet {
  walletId: string;
  addresses: {
    format: string;
    address: string;
    publicKey: string;
  }[];
}

/**
 * Create embedded Stacks wallet with Turnkey
 * Creates a new wallet with a Stacks account
 */
export async function createStacksWallet(params: CreateWalletParams): Promise<TurnkeyWallet> {
  try {
    const client = getTurnkeyClient();
    const { walletName, userId } = params;

    // Create wallet with Stacks account
    const response = await client.apiClient().createWallet({
      walletName: `${walletName}-${userId}`,
      accounts: [
        {
          curve: "CURVE_SECP256K1" as const,
          pathFormat: "PATH_FORMAT_BIP32" as const,
          path: "m/44'/5757'/0'/0/0", // Stacks BIP44 derivation path
          addressFormats: ["ADDRESS_FORMAT_STACKS" as const],
        },
      ],
    });

    // Wait for wallet creation to complete
    const activityPoller = createActivityPoller({
      client: client.apiClient(),
      requestFn: client.apiClient().getActivity,
    });

    const activity = await activityPoller({
      organizationId: client.config.defaultOrganizationId,
      activityId: response.activity.id,
    });

    if (activity.status !== "ACTIVITY_STATUS_COMPLETED") {
      throw new Error(`Wallet creation failed: ${activity.status}`);
    }

    // Extract wallet details from the activity result
    const walletId = activity.result.createWalletResult?.walletId;
    const addresses = activity.result.createWalletResult?.addresses || [];

    if (!walletId || addresses.length === 0) {
      throw new Error("Failed to create wallet: No wallet ID or addresses returned");
    }

    // Return wallet details with properly formatted addresses
    return {
      walletId: walletId!,
      addresses: addresses.map((addr: any) => ({
        format: addr.format || "ADDRESS_FORMAT_STACKS",
        address: addr.address,
        publicKey: addr.publicKey,
      })),
    };
  } catch (error) {
    console.error("Error creating Turnkey wallet:", error);
    throw new Error(`Failed to create Turnkey wallet: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Sign a Stacks transaction with Turnkey
 * Used for sending tips on the Stacks blockchain
 */
export async function signStacksTransaction(params: {
  walletId: string;
  publicKey: string;
  unsignedTransaction: string;
}): Promise<string> {
  try {
    const client = getTurnkeyClient();
    const { publicKey, unsignedTransaction } = params;

    // Sign the transaction using Turnkey's signRawPayload
    const signResult = await client.apiClient().signRawPayload({
      signWith: publicKey,
      payload: unsignedTransaction,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_NO_OP",
    });

    // Poll for signing completion
    const activityPoller = createActivityPoller({
      client: client.apiClient(),
      requestFn: client.apiClient().getActivity,
    });

    const activity = await activityPoller({
      organizationId: client.config.defaultOrganizationId,
      activityId: signResult.activity.id,
    });

    if (activity.status !== "ACTIVITY_STATUS_COMPLETED") {
      throw new Error(`Transaction signing failed: ${activity.status}`);
    }

    const signature = activity.result.signRawPayloadResult?.r + activity.result.signRawPayloadResult?.s;

    if (!signature) {
      throw new Error("Failed to get signature from Turnkey");
    }

    return signature;
  } catch (error) {
    console.error("Error signing transaction with Turnkey:", error);
    throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get wallet details from Turnkey
 */
export async function getWallet(walletId: string): Promise<TurnkeyWallet | null> {
  try {
    const client = getTurnkeyClient();

    const response = await client.apiClient().getWallet({
      walletId,
    });

    if (!response.wallet) {
      return null;
    }

    return {
      walletId: response.wallet.walletId,
      addresses: response.wallet.accounts?.[0]?.addresses || [],
    };
  } catch (error) {
    console.error("Error fetching wallet from Turnkey:", error);
    return null;
  }
}
