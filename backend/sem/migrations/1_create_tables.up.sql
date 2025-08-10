CREATE TABLE sem_plans (
  id TEXT PRIMARY KEY,
  brand_website TEXT NOT NULL,
  competitor_website TEXT NOT NULL DEFAULT '',
  service_locations TEXT[] NOT NULL,
  shopping_budget DOUBLE PRECISION NOT NULL,
  search_budget DOUBLE PRECISION NOT NULL,
  pmax_budget DOUBLE PRECISION NOT NULL,
  total_estimated_cost DOUBLE PRECISION NOT NULL,
  expected_conversions DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE keywords (
  id BIGSERIAL PRIMARY KEY,
  sem_plan_id TEXT NOT NULL REFERENCES sem_plans(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  search_volume INTEGER NOT NULL,
  top_of_page_bid_low DOUBLE PRECISION NOT NULL,
  top_of_page_bid_high DOUBLE PRECISION NOT NULL,
  competition TEXT NOT NULL CHECK (competition IN ('LOW', 'MEDIUM', 'HIGH')),
  intent TEXT NOT NULL CHECK (intent IN ('BRAND', 'CATEGORY', 'COMPETITOR', 'LOCATION', 'LONG_TAIL'))
);

CREATE TABLE ad_groups (
  id BIGSERIAL PRIMARY KEY,
  sem_plan_id TEXT NOT NULL REFERENCES sem_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  suggested_cpc DOUBLE PRECISION NOT NULL,
  match_types TEXT[] NOT NULL
);

CREATE TABLE ad_group_keywords (
  ad_group_id BIGINT NOT NULL REFERENCES ad_groups(id) ON DELETE CASCADE,
  keyword_id BIGINT NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  PRIMARY KEY (ad_group_id, keyword_id)
);

CREATE TABLE search_themes (
  id BIGSERIAL PRIMARY KEY,
  sem_plan_id TEXT NOT NULL REFERENCES sem_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  suggested_bid DOUBLE PRECISION NOT NULL
);

CREATE TABLE shopping_bids (
  id BIGSERIAL PRIMARY KEY,
  sem_plan_id TEXT NOT NULL REFERENCES sem_plans(id) ON DELETE CASCADE,
  product_category TEXT NOT NULL,
  suggested_cpc DOUBLE PRECISION NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  expected_conversions DOUBLE PRECISION NOT NULL
);

CREATE INDEX idx_keywords_sem_plan_id ON keywords(sem_plan_id);
CREATE INDEX idx_ad_groups_sem_plan_id ON ad_groups(sem_plan_id);
CREATE INDEX idx_search_themes_sem_plan_id ON search_themes(sem_plan_id);
CREATE INDEX idx_shopping_bids_sem_plan_id ON shopping_bids(sem_plan_id);
