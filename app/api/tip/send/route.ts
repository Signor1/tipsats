import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { signStacksTransaction } from "@/lib/turnkey/client";
import { usdToMicroSTX, stacksNetwork } from "@/lib/stacks/network";
import { makeSTXTokenTransfer, broadcastTransaction, PostConditionMode } from "@stacks/transactions";

export async function POST(request: Request) {
  try {
    const { recipientAddress, amountUSD, creatorUsername, tipperEmail } =
      await request.json();

    if (!recipientAddress || !amountUSD || !creatorUsername) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find creator
    const creator = await prisma.creator.findUnique({
      where: { username: creatorUsername },
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: "Creator not found" },
        { status: 404 }
      );
    }

    // Convert USD to microSTX
    const amountMicroSTX = usdToMicroSTX(amountUSD);

    // Check if we're using demo sender (for testing) or Turnkey wallet
    const useDemoSender = process.env.DEMO_SENDER_PRIVATE_KEY;

    if (useDemoSender) {
      // Use demo sender for testing (legacy method)
      const { sendTip } = await import("@/lib/stacks/transactions");

      const result = await sendTip({
        senderPrivateKey: useDemoSender,
        recipientAddress,
        amountMicroSTX,
        memo: `Tip from TipSats to @${creatorUsername}`,
      });

      if (!result.success) {
        await prisma.tip.create({
          data: {
            creatorId: creator.id,
            tipperEmail: tipperEmail || "anonymous",
            amountMicroSTX: amountMicroSTX.toString(),
            amountUSD,
            txStatus: "FAILED",
          },
        });

        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }

      // Save successful tip
      const tip = await prisma.tip.create({
        data: {
          creatorId: creator.id,
          tipperEmail: tipperEmail || "anonymous",
          amountMicroSTX: amountMicroSTX.toString(),
          amountUSD,
          txHash: result.txId,
          txStatus: "CONFIRMED",
        },
      });

      // Update creator stats
      await prisma.creator.update({
        where: { id: creator.id },
        data: {
          totalTipsReceived: { increment: Number(amountMicroSTX) / 1_000_000 },
          totalTipsUSD: { increment: amountUSD },
          tipCount: { increment: 1 },
        },
      });

      return NextResponse.json({
        success: true,
        txId: result.txId,
        tipId: tip.id,
        explorerUrl: `https://explorer.stacks.co/txid/${result.txId}?chain=testnet`,
      });
    }

    // Use Turnkey wallet for production
    if (!tipperEmail) {
      return NextResponse.json(
        { success: false, error: "Email required for Turnkey wallet" },
        { status: 400 }
      );
    }

    // Get tipper's wallet
    const tipperWallet = await prisma.wallet.findUnique({
      where: { userEmail: tipperEmail },
    });

    if (!tipperWallet || !tipperWallet.publicKey) {
      return NextResponse.json(
        { success: false, error: "Wallet not found. Please create a wallet first." },
        { status: 404 }
      );
    }

    // Build unsigned transaction
    const txOptions = {
      recipient: recipientAddress,
      amount: amountMicroSTX,
      network: stacksNetwork,
      memo: `Tip from TipSats to @${creatorUsername}`,
      anchorMode: 1, // Any mode
      postConditionMode: PostConditionMode.Allow,
    };

    // Create unsigned transaction
    const unsignedTx = await makeSTXTokenTransfer(txOptions);
    const unsignedTxHex = unsignedTx.serialize().toString("hex");

    // Sign transaction with Turnkey
    const signature = await signStacksTransaction({
      walletId: tipperWallet.turnkeyWalletId,
      publicKey: tipperWallet.publicKey,
      unsignedTransaction: unsignedTxHex,
    });

    // Apply signature to transaction
    // Note: This requires proper signature application logic
    // For now, we'll use the demo sender as fallback
    // TODO: Implement proper signature application

    // Broadcast transaction
    const broadcastResponse = await broadcastTransaction({
      transaction: unsignedTx,
      network: stacksNetwork,
    });

    if (broadcastResponse.error) {
      await prisma.tip.create({
        data: {
          creatorId: creator.id,
          tipperEmail: tipperEmail,
          tipperWalletAddress: tipperWallet.stacksAddress,
          amountMicroSTX: amountMicroSTX.toString(),
          amountUSD,
          txStatus: "FAILED",
        },
      });

      return NextResponse.json(
        { success: false, error: broadcastResponse.error },
        { status: 500 }
      );
    }

    // Save successful tip
    const tip = await prisma.tip.create({
      data: {
        creatorId: creator.id,
        tipperEmail: tipperEmail,
        tipperWalletAddress: tipperWallet.stacksAddress,
        amountMicroSTX: amountMicroSTX.toString(),
        amountUSD,
        txHash: broadcastResponse.txid,
        txStatus: "CONFIRMED",
      },
    });

    // Update creator stats
    await prisma.creator.update({
      where: { id: creator.id },
      data: {
        totalTipsReceived: { increment: Number(amountMicroSTX) / 1_000_000 },
        totalTipsUSD: { increment: amountUSD },
        tipCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      txId: broadcastResponse.txid,
      tipId: tip.id,
      explorerUrl: `https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`,
    });
  } catch (error) {
    console.error("Tip sending error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send tip" },
      { status: 500 }
    );
  }
}
