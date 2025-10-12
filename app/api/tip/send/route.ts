import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sendTip } from "@/lib/stacks/transactions";
import { usdToMicroSTX } from "@/lib/stacks/network";

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

    // TODO: Get sender's private key from Turnkey wallet
    // This requires proper key management and user authentication
    // For now, this will fail in production until Turnkey is integrated
    const senderPrivateKey = process.env.DEMO_SENDER_PRIVATE_KEY;

    if (!senderPrivateKey) {
      // Create pending tip in database (to be processed when wallet is ready)
      const tip = await prisma.tip.create({
        data: {
          creatorId: creator.id,
          tipperEmail: tipperEmail || "anonymous",
          amountMicroSTX: amountMicroSTX.toString(),
          amountUSD,
          txStatus: "PENDING",
        },
      });

      return NextResponse.json({
        success: false,
        error: "Wallet integration pending. Tip saved for processing.",
        tipId: tip.id,
      });
    }

    // Send tip transaction
    const result = await sendTip({
      senderPrivateKey,
      recipientAddress,
      amountMicroSTX,
      memo: `Tip from TipSats to @${creatorUsername}`,
    });

    if (!result.success) {
      // Save failed tip
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

    // Save successful tip to database
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
        totalTipsReceived: {
          increment: Number(amountMicroSTX) / 1_000_000,
        },
        totalTipsUSD: {
          increment: amountUSD,
        },
        tipCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      txId: result.txId,
      tipId: tip.id,
      explorerUrl: `https://explorer.stacks.co/txid/${result.txId}?chain=testnet`,
    });
  } catch (error) {
    console.error("Tip sending error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send tip" },
      { status: 500 }
    );
  }
}
