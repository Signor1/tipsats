/**
 * sBTC Transaction Logic
 * Handles sending tips via Stacks blockchain
 */

import {
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from "@stacks/transactions";
import { stacksNetwork } from "./network";

export interface SendTipParams {
  senderPrivateKey: string;
  recipientAddress: string;
  amountMicroSTX: bigint;
  memo?: string;
}

export interface TipTransactionResult {
  txId: string;
  success: boolean;
  error?: string;
}

/**
 * Send sBTC tip to creator
 */
export async function sendTip(
  params: SendTipParams
): Promise<TipTransactionResult> {
  try {
    const { senderPrivateKey, recipientAddress, amountMicroSTX, memo } = params;

    // Create STX token transfer transaction
    const txOptions = {
      recipient: recipientAddress,
      amount: amountMicroSTX,
      senderKey: senderPrivateKey,
      network: stacksNetwork,
      memo: memo || "TipSats tip ⚡",
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeSTXTokenTransfer(txOptions);

    // Broadcast to Stacks network
    const broadcastResponse = await broadcastTransaction({
      transaction,
      network: stacksNetwork,
    });

    if ("error" in broadcastResponse) {
      return {
        txId: "",
        success: false,
        error: broadcastResponse.error,
      };
    }

    return {
      txId: broadcastResponse.txid,
      success: true,
    };
  } catch (error) {
    console.error("Error sending tip:", error);
    return {
      txId: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get transaction status from Stacks API
 */
export async function getTransactionStatus(txId: string) {
  try {
    const apiUrl = stacksNetwork.isMainnet()
      ? "https://api.mainnet.hiro.so"
      : "https://api.testnet.hiro.so";

    const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch transaction status");
    }

    const data = await response.json();

    return {
      status: data.tx_status,
      blockHeight: data.block_height,
      fee: data.fee_rate,
    };
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    return null;
  }
}

/**
 * Get account balance (STX)
 */
export async function getAccountBalance(address: string): Promise<bigint> {
  try {
    const apiUrl = stacksNetwork.isMainnet()
      ? "https://api.mainnet.hiro.so"
      : "https://api.testnet.hiro.so";

    const response = await fetch(`${apiUrl}/v2/accounts/${address}`);

    if (!response.ok) {
      throw new Error("Failed to fetch account balance");
    }

    const data = await response.json();
    return BigInt(data.balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return BigInt(0);
  }
}
