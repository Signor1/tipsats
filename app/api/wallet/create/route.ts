import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateStacksAddress } from "@/lib/stacks/keys";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { userEmail: email },
    });

    if (existingWallet) {
      return NextResponse.json({
        success: true,
        address: existingWallet.stacksAddress,
        walletId: existingWallet.turnkeyWalletId,
        message: "Wallet already exists",
      });
    }

    // TODO: Replace with real Turnkey SDK integration
    // This requires Turnkey API credentials
    const turnkeyWalletId = `turnkey_${Date.now()}_${email}`;
    const stacksAddress = generateStacksAddress();

    // Save wallet to database
    const wallet = await prisma.wallet.create({
      data: {
        userEmail: email,
        turnkeyWalletId,
        stacksAddress,
      },
    });

    return NextResponse.json({
      success: true,
      address: wallet.stacksAddress,
      walletId: wallet.turnkeyWalletId,
    });
  } catch (error) {
    console.error("Wallet creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
