CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  display_name TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'asl',
  accessibility_profile JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  mode TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  speaker TEXT NOT NULL,
  modality TEXT NOT NULL,
  source_language TEXT,
  target_language TEXT,
  transcript TEXT NOT NULL,
  confidence NUMERIC(5,4),
  sign_tokens JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_runs (
  id UUID PRIMARY KEY,
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  dataset_manifest TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  artifact_uri TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_model_runs_model_name ON model_runs(model_name);
