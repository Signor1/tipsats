import { NextResponse } from "next/server";
import { TurnkeyClient } from "@turnkey/http";
import { ApiKeyStamper } from "@turnkey/api-key-stamper";

export async function POST(request: Request) {
  try {
    const { email, otpId, otpCode } = await request.json();

    if (!email || !otpId || !otpCode) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
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

    // Verify OTP and authenticate
    const response = await turnkeyClient.emailAuth({
      email,
      otpId,
      otpCode,
      organizationId: process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID!,
      authProxyConfigId: process.env.NEXT_PUBLIC_TURNKEY_AUTH_CONFIG_ID!,
    });

    return NextResponse.json({
      success: true,
      userId: response.userId,
      subOrganizationId: response.subOrganizationId,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, error: "Invalid or expired OTP code" },
      { status: 400 }
    );
  }
}
