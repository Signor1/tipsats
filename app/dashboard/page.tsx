"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  ExternalLink,
  TrendingUp,
  Bitcoin,
  DollarSign,
  Zap,
  Download,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);

  // Mock data (in production, fetch from API)
  const creator = {
    username: "alice",
    displayName: "Alice Creator",
    stacksAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    totalTipsReceived: 0.00245,
    totalTipsUSD: 156.78,
    tipCount: 42,
    balance: 0.00245,
  };

  const tipLink = `https://tipsats.app/tip/${creator.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tipLink);
    setCopied(true);
    toast.success("Tip link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const recentTips = [
    {
      id: 1,
      amount: 0.00025,
      amountUSD: 25,
      tipper: "anon_user_123",
      message: "Amazing work!",
      txHash: "0x1234...5678",
      status: "confirmed",
      timestamp: "2024-10-12T10:30:00Z",
    },
    {
      id: 2,
      amount: 0.00010,
      amountUSD: 10,
      tipper: "anon_user_456",
      message: "Keep it up!",
      txHash: "0x8765...4321",
      status: "confirmed",
      timestamp: "2024-10-12T09:15:00Z",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {creator.displayName}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-3xl font-bold sunset-gradient-text">
                ${creator.totalTipsUSD.toFixed(2)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {creator.totalTipsReceived} sBTC
              </p>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Tips</p>
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-3xl font-bold">{creator.tipCount}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                All time tips
              </p>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Avg Tip</p>
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold">
                ${(creator.totalTipsUSD / creator.tipCount).toFixed(2)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Balance</p>
                <Bitcoin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">{creator.balance}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                sBTC available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tip Link Section */}
        <Card className="neumorphic-card mb-8 bitcoin-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Your Tip Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={tipLink}
                readOnly
                className="bg-input border-border font-mono"
              />
              <Button
                onClick={handleCopyLink}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Share this link on Twitter, YouTube, GitHub, or anywhere to receive tips!
            </p>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Tips */}
          <Card className="neumorphic-card md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-card/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bitcoin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">${tip.amountUSD}</div>
                        <div className="text-sm text-muted-foreground">
                          {tip.message}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tip.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-green-500 text-green-500 mb-2">
                        {tip.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          window.open(
                            `https://explorer.stacks.co/txid/${tip.txHash}?chain=testnet`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View TX
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal */}
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle>Withdraw</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                <p className="text-2xl font-bold sunset-gradient-text">
                  {creator.balance} sBTC
                </p>
                <p className="text-sm text-muted-foreground">
                  ≈ ${creator.totalTipsUSD.toFixed(2)}
                </p>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Download className="mr-2 h-5 w-5" />
                Withdraw to Wallet
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Withdraw to any Stacks-compatible wallet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
