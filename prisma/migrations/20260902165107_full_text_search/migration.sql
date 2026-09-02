-- Full-text and fuzzy search for the marketplace.
--
-- The listing page previously had no keyword search at all, and the one
-- text filter it did have (`model contains`) compiled to `ILIKE '%x%'`,
-- which is a sequential scan over every row.

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Generated column, maintained by Postgres on every insert and update, so
-- application code can never write a stale search vector. Brand and model
-- are weighted above the description: someone searching "prado" wants
-- Prados, not every listing whose description mentions one.
ALTER TABLE "Vehicle"
  ADD COLUMN "searchVector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce("brand", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("model", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("shortDescription", '')), 'C')
  ) STORED;

CREATE INDEX "Vehicle_searchVector_idx" ON "Vehicle" USING GIN ("searchVector");

-- Trigram index for misspellings and partial words ("mercedez", "landcru"),
-- which a tsvector match alone will not find.
CREATE INDEX "Vehicle_brand_model_trgm_idx"
  ON "Vehicle" USING GIN (("brand" || ' ' || "model") gin_trgm_ops);
