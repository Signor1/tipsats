"use client";

import { useState, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WalletModal } from "@/components/wallet/WalletModal";
import { TipAmountSelector } from "@/components/wallet/TipAmountSelector";
import { TipButton } from "@/components/wallet/TipButton";
import { ConfettiEffect } from "@/components/wallet/ConfettiEffect";
import { Bitcoin, MapPin, Link2, ExternalLink } from "lucide-react";

interface TipPageProps {
  params: Promise<{ username: string }>;
}

export default function TipPage({ params }: TipPageProps) {
  const { username } = use(params);
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Mock creator data (in production, fetch from API)
  const creator = {
    username: username,
    displayName: "Creator Name",
    bio: "Building cool things with Bitcoin and Stacks",
    avatarUrl: "",
    stacksAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    totalTipsReceived: 156.78,
    tipCount: 42,
  };

  const handleTipSent = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Creator Profile Card */}
        <Card className="neumorphic-card mb-8">
          <CardContent className="p-8">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4 border-2 border-primary bitcoin-glow">
                <AvatarImage src={creator.avatarUrl} alt={creator.displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {creator.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-3xl font-bold mb-2">{creator.displayName}</h1>
              <p className="text-muted-foreground text-lg mb-4">@{creator.username}</p>

              <Badge variant="outline" className="border-primary text-primary mb-4">
                <Bitcoin className="h-4 w-4 mr-1" />
                sBTC Creator
              </Badge>

              {creator.bio && (
                <p className="text-muted-foreground max-w-md">{creator.bio}</p>
              )}
            </div>

            <Separator className="my-6" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center neumorphic-card rounded-lg p-4">
                <div className="text-2xl font-bold sunset-gradient-text">
                  ${creator.totalTipsReceived.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Tips</div>
              </div>
              <div className="text-center neumorphic-card rounded-lg p-4">
                <div className="text-2xl font-bold sunset-gradient-text">
                  {creator.tipCount}
                </div>
                <div className="text-sm text-muted-foreground">Tips Received</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tip Amount Selector */}
        <Card className="neumorphic-card mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bitcoin className="h-6 w-6 text-primary" />
              Select Tip Amount
            </h2>
            <TipAmountSelector
              selectedAmount={selectedAmount}
              onAmountSelect={setSelectedAmount}
            />
          </CardContent>
        </Card>

        {/* Tip Button */}
        {hasWallet ? (
          <TipButton
            creatorAddress={creator.stacksAddress}
            creatorUsername={creator.username}
            amountUSD={selectedAmount}
            onTipSent={handleTipSent}
          />
        ) : (
          <Card className="glass-morphism p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Create a wallet to send tips (takes 10 seconds)
            </p>
            <button
              onClick={() => setWalletModalOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-12 rounded-md bitcoin-glow-hover transition-all"
            >
              Create Wallet & Tip ${selectedAmount}
            </button>
          </Card>
        )}

        {/* Recent Tips */}
        <Card className="neumorphic-card mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Recent Tips</h3>
            <div className="space-y-3">
              {[
                { amount: 10, message: "Great content!", time: "2m ago" },
                { amount: 5, message: "Keep it up!", time: "1h ago" },
                { amount: 25, message: "Amazing work", time: "3h ago" },
              ].map((tip, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bitcoin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">${tip.amount}</div>
                      <div className="text-sm text-muted-foreground">{tip.message}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{tip.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Powered By */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by TipSats • Turnkey Wallets • Stacks sBTC</p>
        </div>
      </div>

      {/* Wallet Creation Modal */}
      <WalletModal
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
        onWalletCreated={(wallet) => {
          setHasWallet(true);
          console.log("Wallet created:", wallet);
        }}
      />

      {/* Confetti Effect */}
      <ConfettiEffect trigger={showConfetti} />
    </div>
  );
}
