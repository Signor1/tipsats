import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user and creator profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        creator: {
          include: {
            tips: {
              take: 20,
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!user?.creator) {
      return NextResponse.json({
        success: true,
        hasCreatorProfile: false,
        message: "No creator profile found",
      });
    }

    const creator = user.creator;

    return NextResponse.json({
      success: true,
      hasCreatorProfile: true,
      creator: {
        username: creator.username,
        displayName: creator.displayName,
        bio: creator.bio,
        avatarUrl: creator.avatarUrl,
        stacksAddress: creator.stacksAddress,
        totalTipsReceived: Number(creator.totalTipsReceived),
        totalTipsUSD: Number(creator.totalTipsUSD),
        tipCount: creator.tipCount,
        tipLink: `https://tipsats.app/tip/${creator.username}`,
      },
      recentTips: creator.tips.map((tip) => ({
        id: tip.id,
        amount: Number(tip.amountUSD),
        amountSTX: Number(tip.amountMicroSTX) / 1_000_000,
        tipperEmail: tip.tipperEmail,
        message: tip.message,
        txHash: tip.txHash,
        status: tip.txStatus,
        timestamp: tip.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
