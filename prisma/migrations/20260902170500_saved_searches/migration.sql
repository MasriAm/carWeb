-- Saved searches.
--
-- Written by hand rather than generated: `prisma migrate dev` re-diffs the
-- whole schema, and its diff of the GENERATED "searchVector" column emits an
-- ALTER COLUMN ... SET DEFAULT that Postgres rejects. Prisma has no way to
-- express a generated column, so any migration touching Vehicle must be
-- reviewed by hand. See docs/PLAN.md.

CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- One row per distinct filter set per user; saving the same search twice
-- updates the existing row rather than piling up duplicates.
CREATE UNIQUE INDEX "SavedSearch_userId_query_key" ON "SavedSearch"("userId", "query");

CREATE INDEX "SavedSearch_userId_createdAt_idx" ON "SavedSearch"("userId", "createdAt" DESC);

ALTER TABLE "SavedSearch"
  ADD CONSTRAINT "SavedSearch_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
