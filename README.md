# TipSats

**Tips at the Speed of Lightning. Powered by Bitcoin.**

TipSats is a frictionless sBTC tipping platform that enables anyone to tip content creators with Bitcoin using Turnkey's embedded wallet SDK. Users can tip without browser extensions, seed phrases, or crypto knowledge—making Bitcoin tipping as simple as liking a post.

Built for the **Stacks Builders Challenge - Embedded Wallet + sBTC**.

![TipSats](https://img.shields.io/badge/Built%20with-Stacks-5546FF?style=for-the-badge)
![Bitcoin](https://img.shields.io/badge/Powered%20by-Bitcoin-F7931A?style=for-the-badge)
![Turnkey](https://img.shields.io/badge/Wallets-Turnkey-000000?style=for-the-badge)

---

## Features

- ✅ **Embedded Wallets**: Create Bitcoin wallets in <10 seconds using email (no seed phrases)
- ✅ **One-Click Tipping**: Send sBTC tips with a single click
- ✅ **Bitcoin Sunset Design**: Premium dark theme with Bitcoin orange, deep purple, and electric blue
- ✅ **Real sBTC Transactions**: Powered by Stacks blockchain
- ✅ **Creator Dashboard**: Track tips, manage earnings, withdraw to external wallets
- ✅ **Shareable Links**: Unique tip links (tipsats.app/tip/username) for easy sharing
- ✅ **Zero Platform Fees**: Creators receive 100% of tips

---

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Wallet SDK**: Turnkey Embedded Wallets
- **Blockchain**: Stacks.js, sBTC (Stacks testnet)
- **UI Components**: shadcn/ui, Framer Motion
- **Database**: Vercel Postgres / Supabase
- **Deployment**: Vercel

---

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Turnkey account (sign up at [app.turnkey.com](https://app.turnkey.com))
- Vercel account (optional, for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tipsats.git
   cd tipsats
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Turnkey credentials:
   ```env
   NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID=your_turnkey_org_id
   TURNKEY_API_PUBLIC_KEY=your_turnkey_api_public_key
   TURNKEY_API_PRIVATE_KEY=your_turnkey_api_private_key
   NEXT_PUBLIC_STACKS_NETWORK=testnet
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Getting Turnkey API Credentials

1. Sign up at [app.turnkey.com](https://app.turnkey.com)
2. Create a new organization
3. Generate API credentials:
   - Go to **Settings** → **API Keys**
   - Create a new API key
   - Copy the Organization ID, Public Key, and Private Key
4. Add credentials to `.env.local`

---

## Project Structure

```
tipsats/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── tip/[username]/page.tsx     # Creator tip page
│   ├── dashboard/page.tsx          # Creator dashboard
│   ├── api/
│   │   ├── wallet/create/route.ts  # Wallet creation endpoint
│   │   ├── tip/send/route.ts       # Tip sending endpoint
│   │   └── creator/register/route.ts
├── components/
│   ├── wallet/
│   │   ├── WalletModal.tsx         # Embedded wallet creation
│   │   ├── TipButton.tsx           # One-click tip button
│   │   ├── TipAmountSelector.tsx   # Amount selection UI
│   │   └── ConfettiEffect.tsx      # Success animations
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── turnkey/
│   │   └── client.ts               # Turnkey SDK setup
│   ├── stacks/
│   │   ├── network.ts              # Stacks network config
│   │   └── transactions.ts         # sBTC transaction logic
│   └── db/
│       └── schema.sql              # Database schema
└── app/globals.css                  # Bitcoin Sunset design system
```

---

## Usage

### For Creators

1. **Create Your Wallet**
   - Visit the homepage
   - Click "Create Your Tip Link"
   - Enter your email (wallet created instantly)

2. **Get Your Tip Link**
   - Go to your dashboard
   - Copy your unique link: `tipsats.app/tip/yourname`
   - Share on Twitter, YouTube, GitHub, anywhere!

3. **Receive Tips**
   - View tips in real-time on your dashboard
   - Withdraw sBTC to external wallet anytime

### For Tippers

1. **Visit Creator's Link**
   - Go to `tipsats.app/tip/username`

2. **Select Amount**
   - Choose $1, $5, $10, or custom amount

3. **Create Wallet (First Time)**
   - Enter email to create embedded wallet (<10 sec)

4. **Send Tip**
   - Click "Tip" button
   - Transaction confirms in seconds
   - Confetti celebration!

---

## Bitcoin Sunset Design System

TipSats uses a premium dark theme inspired by Bitcoin's vibrant ecosystem:

### Colors
- **Bitcoin Orange**: `#F7931A` - Primary CTAs, branding
- **Deep Purple**: `#5B21B6` - Premium accents
- **Electric Blue**: `#3B82F6` - Secondary actions
- **Dark Background**: `#0F0F0F` - Premium feel

### Design Features
- Neumorphic cards with orange glow on hover
- Glass morphism modals with backdrop blur
- Confetti animations on successful tips
- Gradient text effects (orange → purple)

---

## Database Schema

```sql
-- Creators table
CREATE TABLE creators (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  stacks_address VARCHAR(64) NOT NULL,
  turnkey_wallet_id VARCHAR(100),
  total_tips_received DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tips table
CREATE TABLE tips (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  tipper_email VARCHAR(255),
  amount_micro_stx BIGINT NOT NULL,
  amount_usd DECIMAL NOT NULL,
  tx_hash VARCHAR(128),
  tx_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.example`
   - Deploy!

3. **Configure Database**
   - Add Vercel Postgres from the dashboard
   - Run schema: `psql $POSTGRES_URL < lib/db/schema.sql`

---

## Testing on Stacks Testnet

1. **Get Test STX**
   - Visit [Stacks Testnet Faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet)
   - Request test STX tokens

2. **Send Test Tip**
   - Use a creator's tip link
   - Select amount and send
   - View transaction on [Stacks Explorer](https://explorer.stacks.co/?chain=testnet)

3. **Verify Transaction**
   - Check transaction hash
   - Confirm status (pending → confirmed)
   - View on Stacks Explorer

---

## Demo Credentials

For judges/reviewers to test:

**Demo Creator Account**
- Username: `alice`
- Tip Link: `tipsats.app/tip/alice`
- Stacks Address: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`

**Test Tipper Flow**
- Create wallet with any email
- Tip amounts: $1, $5, $10
- View transaction on testnet explorer

---

## Roadmap

### Phase 1: MVP (Current)
- ✅ Embedded wallet creation
- ✅ One-click sBTC tipping
- ✅ Creator dashboard
- ✅ Testnet deployment

### Phase 2: Enhanced Features
- [ ] Tip messages (140 char notes)
- [ ] Leaderboard (top tippers/creators)
- [ ] Social share cards with OG images
- [ ] Email notifications

### Phase 3: Production
- [ ] Mainnet deployment
- [ ] Native Stacks wallet support in Turnkey SDK
- [ ] Clarity smart contracts for escrow
- [ ] Mobile app (React Native)

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Acknowledgments

- **Turnkey** - Embedded wallet infrastructure
- **Stacks Foundation** - sBTC and blockchain support
- **Hiro** - Stacks.js and developer tools
- **shadcn/ui** - Beautiful UI components

---

## Contact

- **Website**: [tipsats.app](https://tipsats.app)
- **Telegram**: [Join Community](https://t.me/+tdhAoFHAtdk0MGVh)
- **Twitter**: [@TipSats](https://twitter.com/tipsats)

---

**Built with ❤️ for the Stacks Builders Challenge**

🚀 **Ship a working demo. Make Bitcoin tipping effortless.**
