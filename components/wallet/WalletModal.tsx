"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { toast } from "sonner";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletCreated: (wallet: { address: string; email: string }) => void;
}

export function WalletModal({ open, onOpenChange, onWalletCreated }: WalletModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const { handleLogin, authState, user } = useTurnkey();

  // Memoize user email
  const userEmail = useMemo(
    () => user?.userEmail || user?.userName || user?.email || "user@tipsats.app",
    [user?.userEmail, user?.userName, user?.email]
  );

  // Handle wallet creation after authentication
  useEffect(() => {
    // Wait for full user data to be loaded
    if (authState !== "authenticated" || !hasAuthenticated || isCreating || !open || !user?.userId) {
      return;
    }

    let isMounted = true;

    const createWalletAfterAuth = async () => {
      setIsCreating(true);

      try {
        console.log("Creating Stacks wallet for:", userEmail);
        console.log("User ID:", user?.userId);

        // Create wallet using server-side API (supports Stacks!)
        const response = await fetch("/api/wallet/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            userId: user?.userId,
          }),
        });

        if (!isMounted) return;

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to create wallet");
        }

        console.log("Wallet created:", data);

        toast.success("Wallet created successfully!");
        onWalletCreated({ address: data.address, email: userEmail });

        // Reset and close
        setTimeout(() => {
          if (isMounted) {
            onOpenChange(false);
            setIsCreating(false);
            setHasAuthenticated(false);
          }
        }, 1500);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error creating wallet:", error);
        toast.error("Failed to create wallet. Please try again.");
        setIsCreating(false);
        setHasAuthenticated(false);
      }
    };

    createWalletAfterAuth();

    return () => {
      isMounted = false;
    };
  }, [authState, hasAuthenticated, open, isCreating, userEmail, user?.userId, onWalletCreated, onOpenChange]);

  const handleCreateWallet = useCallback(async () => {
    try {
      console.log("Opening Turnkey authentication modal...");
      await handleLogin();
      setHasAuthenticated(true);
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("Authentication failed. Please try again.");
    }
  }, [handleLogin]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold sunset-gradient-text flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            {isCreating ? "Creating Wallet..." : "Create Your Wallet"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isCreating
              ? "Setting up your Stacks wallet..."
              : "Create your Bitcoin wallet with secure authentication. No seed phrases needed."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isCreating ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-lg font-medium">Creating your Stacks wallet...</p>
              <p className="text-sm text-muted-foreground">This will only take a moment</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Click below to authenticate and create your wallet
                </p>
                <p className="text-xs text-muted-foreground">
                  You can sign up with email OTP or passkey
                </p>
              </div>

              <Button
                onClick={handleCreateWallet}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg h-12 bitcoin-glow-hover"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Create Wallet
              </Button>
            </>
          )}

          <div className="text-center text-xs text-muted-foreground">
            <p>🔐 Powered by Turnkey embedded wallets</p>
            <p>Non-custodial • Your keys, your crypto</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
