CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- For full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- For composite indexes




-- --------------------------------------------------


CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT NOT NULL UNIQUE,
  display_name      TEXT NOT NULL DEFAULT '',
  avatar_url        TEXT,
  role              TEXT NOT NULL DEFAULT 'free'
                    CHECK (role IN ('free', 'premium', 'agency', 'admin')),
  country           TEXT,
  timezone          TEXT DEFAULT 'UTC',
  experience_level  TEXT DEFAULT 'beginner'
                    CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  risk_appetite     TEXT DEFAULT 'medium'
                    CHECK (risk_appetite IN ('low', 'medium', 'high')),
  preferred_pairs   TEXT[] DEFAULT '{}',
  telegram_chat_id  TEXT,
  webhook_secret    TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
  is_active         BOOLEAN DEFAULT true,
  last_seen_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));




-- --------------------------------------------------


CREATE TABLE pairs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol           TEXT NOT NULL UNIQUE,  -- 'EURUSD'
  slug             TEXT NOT NULL UNIQUE,  -- 'eurusd'
  display_name     TEXT NOT NULL,         -- 'EUR/USD'
  base_currency    TEXT NOT NULL,         -- 'EUR'
  quote_currency   TEXT NOT NULL,         -- 'USD'
  category         TEXT NOT NULL
                   CHECK (category IN ('forex', 'commodities', 'crypto', 'indices')),
  description      TEXT,
  pip_decimal      INTEGER DEFAULT 4,     -- 4 for most pairs, 2 for JPY
  is_active        BOOLEAN DEFAULT true,
  display_order    INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pairs_category ON pairs(category) WHERE is_active = true;
CREATE INDEX idx_pairs_slug ON pairs(slug);

ALTER TABLE pairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pairs are publicly readable"
  ON pairs FOR SELECT USING (true);

-- Seed data
INSERT INTO pairs (symbol, slug, display_name, base_currency, quote_currency, category, pip_decimal, display_order) VALUES
('EURUSD', 'eurusd', 'EUR/USD', 'EUR', 'USD', 'forex', 4, 1),
('GBPUSD', 'gbpusd', 'GBP/USD', 'GBP', 'USD', 'forex', 4, 2),
('USDJPY', 'usdjpy', 'USD/JPY', 'USD', 'JPY', 'forex', 2, 3),
('USDCHF', 'usdchf', 'USD/CHF', 'USD', 'CHF', 'forex', 4, 4),
('AUDUSD', 'audusd', 'AUD/USD', 'AUD', 'USD', 'forex', 4, 5),
('NZDUSD', 'nzdusd', 'NZD/USD', 'NZD', 'USD', 'forex', 4, 6),
('USDCAD', 'usdcad', 'USD/CAD', 'USD', 'CAD', 'forex', 4, 7),
('GBPJPY', 'gbpjpy', 'GBP/JPY', 'GBP', 'JPY', 'forex', 2, 8),
('EURJPY', 'eurjpy', 'EUR/JPY', 'EUR', 'JPY', 'forex', 2, 9),
('EURGBP', 'eurgbp', 'EUR/GBP', 'EUR', 'GBP', 'forex', 4, 10),
('GBPAUD', 'gbpaud', 'GBP/AUD', 'GBP', 'AUD', 'forex', 4, 11),
('AUDJPY', 'audjpy', 'AUD/JPY', 'AUD', 'JPY', 'forex', 2, 12),
('XAUUSD', 'xauusd', 'XAU/USD', 'XAU', 'USD', 'commodities', 2, 13),
('XAGUSD', 'xagusd', 'XAG/USD', 'XAG', 'USD', 'commodities', 4, 14),
('BTCUSD', 'btcusd', 'BTC/USD', 'BTC', 'USD', 'crypto', 2, 15),
('ETHUSD', 'ethusd', 'ETH/USD', 'ETH', 'USD', 'crypto', 2, 16),
('USDMXN', 'usdmxn', 'USD/MXN', 'USD', 'MXN', 'forex', 4, 17),
('USDZAR', 'usdzar', 'USD/ZAR', 'USD', 'ZAR', 'forex', 4, 18),
('USDNOK', 'usdnok', 'USD/NOK', 'USD', 'NOK', 'forex', 4, 19),
('USDSEK', 'usdsek', 'USD/SEK', 'USD', 'SEK', 'forex', 4, 20);




-- --------------------------------------------------


CREATE TABLE signals (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pair_id           UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  direction         TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL', 'NEUTRAL')),
  confidence        INTEGER NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  entry             DECIMAL(18, 5) NOT NULL,
  stop              DECIMAL(18, 5) NOT NULL,
  target            DECIMAL(18, 5) NOT NULL,
  risk_pips         INTEGER NOT NULL,
  reward_pips       INTEGER NOT NULL,
  r_multiple        DECIMAL(5, 2) NOT NULL,
  risk_level        TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  setup             TEXT NOT NULL,    -- Human-readable signal reasoning
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'expired', 'cancelled', 'hit_tp', 'hit_sl')),
  bullish_pct       INTEGER CHECK (bullish_pct BETWEEN 0 AND 100),
  bearish_pct       INTEGER CHECK (bearish_pct BETWEEN 0 AND 100),
  opportunity_score INTEGER CHECK (opportunity_score BETWEEN 0 AND 100),
  supporting_factors TEXT[],           -- Array of bullet point reasons
  created_by        UUID REFERENCES profiles(id),
  expires_at        TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_signals_pair_id ON signals(pair_id);
CREATE INDEX idx_signals_status ON signals(status) WHERE status = 'active';
CREATE INDEX idx_signals_direction ON signals(direction);
CREATE INDEX idx_signals_confidence ON signals(confidence DESC);
CREATE INDEX idx_signals_updated ON signals(updated_at DESC);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signals are publicly readable"
  ON signals FOR SELECT USING (true);
CREATE POLICY "Only admins can insert signals"
  ON signals FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));
CREATE POLICY "Only admins can update signals"
  ON signals FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE TRIGGER signals_updated_at
  BEFORE UPDATE ON signals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();




-- --------------------------------------------------


CREATE TABLE signal_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id   UUID NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  pair_id     UUID NOT NULL REFERENCES pairs(id),
  direction   TEXT NOT NULL,
  confidence  INTEGER NOT NULL,
  entry       DECIMAL(18, 5),
  stop        DECIMAL(18, 5),
  target      DECIMAL(18, 5),
  status      TEXT NOT NULL,
  changed_at  TIMESTAMPTZ DEFAULT NOW(),
  changed_by  UUID REFERENCES profiles(id)
);

CREATE INDEX idx_signal_history_signal_id ON signal_history(signal_id);
CREATE INDEX idx_signal_history_pair_id ON signal_history(pair_id);

ALTER TABLE signal_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signal history publicly readable"
  ON signal_history FOR SELECT USING (true);




-- --------------------------------------------------


CREATE TABLE forecasts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pair_id             UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  bullish_score       INTEGER NOT NULL CHECK (bullish_score BETWEEN 0 AND 100),
  bearish_score       INTEGER NOT NULL CHECK (bearish_score BETWEEN 0 AND 100),
  trend               TEXT NOT NULL
                      CHECK (trend IN (
                        'Strong Bullish', 'Bullish', 'Neutral',
                        'Bearish', 'Strong Bearish'
                      )),
  support_levels      DECIMAL(18,5)[] NOT NULL DEFAULT '{}',
  resistance_levels   DECIMAL(18,5)[] NOT NULL DEFAULT '{}',
  technical_summary   TEXT NOT NULL,
  fundamental_summary TEXT NOT NULL,
  forecast_summary    TEXT NOT NULL,
  ema_signal          TEXT,           -- 'Bullish', 'Bearish', 'Neutral'
  rsi_value           INTEGER,        -- Current RSI reading
  macd_signal         TEXT,           -- 'Bullish cross', 'Bearish cross'
  timeframe           TEXT DEFAULT 'daily'
                      CHECK (timeframe IN ('daily', 'weekly', 'monthly')),
  valid_until         TIMESTAMPTZ NOT NULL,
  created_by          UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forecasts_pair_id ON forecasts(pair_id);
CREATE INDEX idx_forecasts_valid ON forecasts(valid_until DESC);
CREATE INDEX idx_forecasts_trend ON forecasts(trend);

ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forecasts publicly readable" ON forecasts FOR SELECT USING (true);
CREATE POLICY "Only admins can manage forecasts"
  ON forecasts FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE TRIGGER forecasts_updated_at
  BEFORE UPDATE ON forecasts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();




-- --------------------------------------------------


CREATE TABLE opportunities (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pair_id           UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  signal_id         UUID REFERENCES signals(id),
  opportunity_score INTEGER NOT NULL CHECK (opportunity_score BETWEEN 0 AND 100),
  trend_score       INTEGER NOT NULL CHECK (trend_score BETWEEN 0 AND 100),
  sentiment_score   INTEGER NOT NULL CHECK (sentiment_score BETWEEN 0 AND 100),
  consensus_score   INTEGER NOT NULL CHECK (consensus_score BETWEEN 0 AND 100),
  volatility_score  INTEGER NOT NULL CHECK (volatility_score BETWEEN 0 AND 100),
  news_risk_score   INTEGER NOT NULL CHECK (news_risk_score BETWEEN 0 AND 100),
  trend             TEXT NOT NULL,
  news_risk         TEXT NOT NULL CHECK (news_risk IN ('Low', 'Medium', 'High')),
  sentiment         TEXT NOT NULL,
  direction         TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL', 'NEUTRAL')),
  rank              INTEGER,
  is_top            BOOLEAN DEFAULT false,
  calculated_at     TIMESTAMPTZ DEFAULT NOW(),
  valid_until       TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_opportunities_score ON opportunities(opportunity_score DESC);
CREATE INDEX idx_opportunities_pair ON opportunities(pair_id);
CREATE INDEX idx_opportunities_top ON opportunities(is_top) WHERE is_top = true;
CREATE INDEX idx_opportunities_valid ON opportunities(valid_until);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Opportunities publicly readable"
  ON opportunities FOR SELECT USING (true);




-- --------------------------------------------------


CREATE TABLE sentiment (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pair_id               UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  retail_bullish_pct    INTEGER NOT NULL CHECK (retail_bullish_pct BETWEEN 0 AND 100),
  retail_bearish_pct    INTEGER NOT NULL CHECK (retail_bearish_pct BETWEEN 0 AND 100),
  institutional_bias    TEXT CHECK (institutional_bias IN ('Bullish', 'Bearish', 'Neutral')),
  overall_sentiment     TEXT NOT NULL CHECK (overall_sentiment IN ('Bullish', 'Bearish', 'Neutral')),
  source                TEXT DEFAULT 'manual',
  recorded_at           TIMESTAMPTZ DEFAULT NOW(),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sentiment_pair ON sentiment(pair_id);
CREATE INDEX idx_sentiment_recorded ON sentiment(recorded_at DESC);

ALTER TABLE sentiment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sentiment publicly readable" ON sentiment FOR SELECT USING (true);




-- --------------------------------------------------


CREATE TABLE economic_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,   -- 'usd-nfp-2025-07'
  title           TEXT NOT NULL,
  currency        TEXT NOT NULL,
  country         TEXT NOT NULL,
  impact          TEXT NOT NULL CHECK (impact IN ('High', 'Medium', 'Low')),
  event_datetime  TIMESTAMPTZ NOT NULL,
  forecast        TEXT,
  previous        TEXT,
  actual          TEXT,                   -- NULL until released
  description     TEXT,
  affected_pairs  TEXT[] DEFAULT '{}',    -- Array of pair slugs
  source          TEXT DEFAULT 'forex_factory',
  is_released     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_datetime ON economic_events(event_datetime);
CREATE INDEX idx_events_currency ON economic_events(currency);
CREATE INDEX idx_events_impact ON economic_events(impact);
CREATE INDEX idx_events_released ON economic_events(is_released);
CREATE INDEX idx_events_slug ON economic_events(slug);

ALTER TABLE economic_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Economic events publicly readable"
  ON economic_events FOR SELECT USING (true);

CREATE TRIGGER economic_events_updated_at
  BEFORE UPDATE ON economic_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();




-- --------------------------------------------------


CREATE TABLE news (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  summary       TEXT NOT NULL,
  content       TEXT,
  source        TEXT NOT NULL,
  source_url    TEXT,
  image_url     TEXT,
  impact        TEXT CHECK (impact IN ('High', 'Medium', 'Low')),
  affected_pairs TEXT[] DEFAULT '{}',
  tags          TEXT[] DEFAULT '{}',
  is_published  BOOLEAN DEFAULT true,
  published_at  TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_published ON news(published_at DESC);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_tags ON news USING GIN(tags);
CREATE INDEX idx_news_pairs ON news USING GIN(affected_pairs);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published news publicly readable"
  ON news FOR SELECT USING (is_published = true);




-- --------------------------------------------------


CREATE TABLE brokers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  logo_url          TEXT,
  description       TEXT NOT NULL,
  overall_score     INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  trust_score       INTEGER CHECK (trust_score BETWEEN 0 AND 100),
  fees_score        INTEGER CHECK (fees_score BETWEEN 0 AND 100),
  platform_score    INTEGER CHECK (platform_score BETWEEN 0 AND 100),
  rating            DECIMAL(3,1) CHECK (rating BETWEEN 0 AND 5),
  review_count      INTEGER DEFAULT 0,
  regulation        TEXT[] NOT NULL DEFAULT '{}',
  min_deposit       INTEGER,
  max_leverage      TEXT,
  platforms         TEXT[] DEFAULT '{}',
  spread_eurusd     DECIMAL(5,2),
  spread_gbpusd     DECIMAL(5,2),
  spread_xauusd     DECIMAL(5,2),
  founded           INTEGER,
  headquarters      TEXT,
  pros              TEXT[] DEFAULT '{}',
  cons              TEXT[] DEFAULT '{}',
  affiliate_url     TEXT,
  is_top_rated      BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  display_order     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brokers_rating ON brokers(rating DESC) WHERE is_active = true;
CREATE INDEX idx_brokers_slug ON brokers(slug);
CREATE INDEX idx_brokers_top ON brokers(is_top_rated) WHERE is_top_rated = true;

ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brokers publicly readable" ON brokers FOR SELECT USING (is_active = true);




-- --------------------------------------------------


CREATE TABLE watchlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pair_id     UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pair_id)
);

CREATE INDEX idx_watchlists_user ON watchlists(user_id);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own watchlist"
  ON watchlists FOR ALL USING (auth.uid() = user_id);




-- --------------------------------------------------


CREATE TABLE alerts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pair_id         UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  alert_type      TEXT NOT NULL
                  CHECK (alert_type IN ('signal', 'forecast', 'opportunity', 'price')),
  direction       TEXT CHECK (direction IN ('BUY', 'SELL', 'NEUTRAL', 'ANY')),
  min_confidence  INTEGER DEFAULT 0,
  price_level     DECIMAL(18,5),
  price_condition TEXT CHECK (price_condition IN ('above', 'below')),
  channels        TEXT[] DEFAULT '{"email"}',  -- email, telegram, webhook
  is_active       BOOLEAN DEFAULT true,
  last_triggered  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_pair ON alerts(pair_id);
CREATE INDEX idx_alerts_active ON alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_alerts_type ON alerts(alert_type);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own alerts"
  ON alerts FOR ALL USING (auth.uid() = user_id);




-- --------------------------------------------------


CREATE TABLE alert_deliveries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id    UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel     TEXT NOT NULL,
  payload     JSONB,
  status      TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alert_deliveries_alert ON alert_deliveries(alert_id);
CREATE INDEX idx_alert_deliveries_user ON alert_deliveries(user_id);

ALTER TABLE alert_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own alert deliveries"
  ON alert_deliveries FOR SELECT USING (auth.uid() = user_id);




-- --------------------------------------------------


CREATE TABLE journal_entries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pair_id         UUID REFERENCES pairs(id),
  pair_symbol     TEXT NOT NULL,
  direction       TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  entry_price     DECIMAL(18,5) NOT NULL,
  exit_price      DECIMAL(18,5),
  stop_loss       DECIMAL(18,5),
  take_profit     DECIMAL(18,5),
  lot_size        DECIMAL(10,4) NOT NULL,
  pips_gained     DECIMAL(10,2),
  profit_loss     DECIMAL(15,2),
  r_multiple      DECIMAL(5,2),
  outcome         TEXT CHECK (outcome IN ('win', 'loss', 'breakeven', 'open')),
  setup           TEXT,
  notes           TEXT,
  screenshot_url  TEXT,
  trade_date      TIMESTAMPTZ NOT NULL,
  closed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journal_user ON journal_entries(user_id);
CREATE INDEX idx_journal_pair ON journal_entries(pair_symbol);
CREATE INDEX idx_journal_outcome ON journal_entries(outcome);
CREATE INDEX idx_journal_date ON journal_entries(trade_date DESC);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own journal"
  ON journal_entries FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER journal_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();




-- --------------------------------------------------


CREATE TABLE subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  plan                    TEXT NOT NULL DEFAULT 'free'
                          CHECK (plan IN ('free', 'premium', 'agency')),
  status                  TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN DEFAULT false,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);




-- --------------------------------------------------


CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id),
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  ip_address  TEXT,
  user_agent  TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins view audit logs"
  ON audit_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));




-- --------------------------------------------------


-- Active signals with pair info (most used join)
CREATE OR REPLACE VIEW active_signals_view AS
SELECT
  s.*,
  p.symbol,
  p.slug,
  p.display_name,
  p.category,
  p.pip_decimal
FROM signals s
JOIN pairs p ON s.pair_id = p.id
WHERE s.status = 'active'
  AND s.expires_at > NOW()
ORDER BY s.confidence DESC;

-- Top opportunities with pair and signal info
CREATE OR REPLACE VIEW top_opportunities_view AS
SELECT
  o.*,
  p.symbol,
  p.slug,
  p.display_name,
  p.category,
  s.direction,
  s.confidence,
  s.entry,
  s.stop,
  s.target,
  s.r_multiple,
  s.setup
FROM opportunities o
JOIN pairs p ON o.pair_id = p.id
LEFT JOIN signals s ON o.signal_id = s.id
WHERE o.valid_until > NOW()
ORDER BY o.opportunity_score DESC;

-- User journal performance summary
CREATE OR REPLACE VIEW journal_performance_view AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE outcome IS NOT NULL AND outcome != 'open') AS total_trades,
  COUNT(*) FILTER (WHERE outcome = 'win') AS wins,
  COUNT(*) FILTER (WHERE outcome = 'loss') AS losses,
  COUNT(*) FILTER (WHERE outcome = 'breakeven') AS breakevens,
  ROUND(
    COUNT(*) FILTER (WHERE outcome = 'win')::DECIMAL /
    NULLIF(COUNT(*) FILTER (WHERE outcome IN ('win','loss')), 0) * 100, 2
  ) AS win_rate,
  ROUND(AVG(r_multiple) FILTER (WHERE outcome IS NOT NULL), 2) AS avg_r_multiple,
  ROUND(SUM(profit_loss), 2) AS total_pnl,
  MAX(profit_loss) AS best_trade,
  MIN(profit_loss) AS worst_trade
FROM journal_entries
GROUP BY user_id;

