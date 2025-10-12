"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wallet, Check } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletCreated: (wallet: { address: string; email: string }) => void;
}

export function WalletModal({ open, onOpenChange, onWalletCreated }: WalletModalProps) {
  const [email, setEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const handleCreateWallet = async () => {
    if (!email || !email.includes("@")) return;

    setIsCreating(true);

    try {
      // Call API to create embedded wallet
      const response = await fetch("/api/wallet/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setCreated(true);
        setTimeout(() => {
          onWalletCreated({ address: data.address, email });
          onOpenChange(false);
          setCreated(false);
          setEmail("");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold sunset-gradient-text flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Create Your Wallet
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create your Bitcoin wallet in less than 10 seconds. No seed phrases, no extensions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border focus:border-primary"
              disabled={isCreating || created}
            />
            <p className="text-xs text-muted-foreground">
              We'll use this to secure your wallet and send notifications
            </p>
          </div>

          <Button
            onClick={handleCreateWallet}
            disabled={!email || isCreating || created}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg h-12 bitcoin-glow-hover"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Wallet...
              </>
            ) : created ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Wallet Created!
              </>
            ) : (
              "Create Wallet Instantly"
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            <p>Powered by Turnkey embedded wallets</p>
            <p>Your keys, your crypto — we never have access</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
