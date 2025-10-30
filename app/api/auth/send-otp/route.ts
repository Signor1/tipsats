import { NextResponse } from "next/server";
import { TurnkeyClient } from "@turnkey/http";
import { ApiKeyStamper } from "@turnkey/api-key-stamper";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const stamper = new ApiKeyStamper({
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
    });

    const turnkeyClient = new TurnkeyClient(
      { baseUrl: process.env.NEXT_PUBLIC_TURNKEY_BASE_URL! },
      stamper
    );

    // Initialize email authentication
    const response = await turnkeyClient.initEmailAuth({
      email,
      organizationId: process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID!,
    });

    return NextResponse.json({
      success: true,
      otpId: response.otpId,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
