import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const creator = await prisma.creator.findUnique({
      where: { username },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        tips: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            amountUSD: true,
            message: true,
            createdAt: true,
            txStatus: true,
          },
        },
      },
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: "Creator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      creator: {
        username: creator.username,
        displayName: creator.displayName || creator.user.name,
        bio: creator.bio,
        avatarUrl: creator.avatarUrl || creator.user.image,
        stacksAddress: creator.stacksAddress,
        totalTipsReceived: Number(creator.totalTipsReceived),
        totalTipsUSD: Number(creator.totalTipsUSD),
        tipCount: creator.tipCount,
        recentTips: creator.tips.map((tip) => ({
          id: tip.id,
          amount: Number(tip.amountUSD),
          message: tip.message,
          timestamp: tip.createdAt,
          status: tip.txStatus,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching creator:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch creator" },
      { status: 500 }
    );
  }
}
