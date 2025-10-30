"use client";

import { TurnkeyProvider } from "@turnkey/react-wallet-kit";
// CSS imported in globals.css using @import (Tailwind v3 compatible method)
import { ReactNode } from "react";

interface TurnkeyWrapperProps {
  children: ReactNode;
}

export function TurnkeyWrapper({ children }: TurnkeyWrapperProps) {
  const config = {
    organizationId: process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID!,
    authProxyConfigId: process.env.NEXT_PUBLIC_TURNKEY_AUTH_CONFIG_ID!,
  };

  return (
    <TurnkeyProvider
      config={config}
      callbacks={{
        onError: (error) => {
          console.error("Turnkey error:", error);
        },
        onAuthenticationSuccess: ({ session }) => {
          console.log("User authenticated successfully:", session);
        },
      }}
    >
      {children}
    </TurnkeyProvider>
  );
}
