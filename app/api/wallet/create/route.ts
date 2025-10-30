import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateStacksWallet } from "@/lib/wallet/stacks";

export async function POST(request: Request) {
  try {
    const { email, userId } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing user ID" },
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
        message: "Wallet already exists",
      });
    }

    console.log("Creating Stacks wallet for:", email);

    // Generate Stacks wallet using Hiro SDK
    const wallet = await generateStacksWallet(userId);

    console.log("Stacks wallet created:", wallet.address);

    // Save wallet to database
    const savedWallet = await prisma.wallet.create({
      data: {
        userEmail: email,
        turnkeyWalletId: userId, // Store userId for deterministic wallet recovery
        stacksAddress: wallet.address,
        publicKey: wallet.publicKey,
      },
    });

    console.log("Wallet saved to database:", savedWallet.stacksAddress);

    return NextResponse.json({
      success: true,
      address: savedWallet.stacksAddress,
      message: "Wallet created successfully!",
    });
  } catch (error) {
    console.error("Wallet creation error:", error);

    return NextResponse.json(
      { success: false, error: `Failed to create wallet: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
