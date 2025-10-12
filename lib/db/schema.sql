-- TipSats Database Schema
-- For Vercel Postgres or Supabase

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  stacks_address VARCHAR(64) NOT NULL,
  turnkey_wallet_id VARCHAR(100),
  total_tips_received DECIMAL DEFAULT 0,
  total_tips_usd DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tips table
CREATE TABLE IF NOT EXISTS tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  tipper_email VARCHAR(255),
  tipper_wallet_address VARCHAR(64),
  amount_micro_stx BIGINT NOT NULL,
  amount_usd DECIMAL NOT NULL,
  message TEXT,
  tx_hash VARCHAR(128),
  tx_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wallets table (for embedded wallets)
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) UNIQUE NOT NULL,
  turnkey_wallet_id VARCHAR(100) NOT NULL,
  stacks_address VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_creators_username ON creators(username);
CREATE INDEX IF NOT EXISTS idx_tips_creator_id ON tips(creator_id);
CREATE INDEX IF NOT EXISTS idx_tips_tx_hash ON tips(tx_hash);
CREATE INDEX IF NOT EXISTS idx_wallets_email ON wallets(user_email);
