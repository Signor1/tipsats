import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username, displayName, bio, stacksAddress } = await request.json();

    if (!username || !stacksAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,50}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          success: false,
          error: "Username must be 3-50 characters (letters, numbers, -, _)",
        },
        { status: 400 }
      );
    }

    // Check if username already taken
    const existingCreator = await prisma.creator.findUnique({
      where: { username },
    });

    if (existingCreator) {
      return NextResponse.json(
        { success: false, error: "Username already taken" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
      });
    }

    // Create creator profile
    const creator = await prisma.creator.create({
      data: {
        userId: user.id,
        username,
        displayName: displayName || session.user.name,
        bio,
        stacksAddress,
      },
    });

    return NextResponse.json({
      success: true,
      tipLink: `https://tipsats.app/tip/${username}`,
      username: creator.username,
      creatorId: creator.id,
    });
  } catch (error) {
    console.error("Creator registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register creator" },
      { status: 500 }
    );
  }
}
