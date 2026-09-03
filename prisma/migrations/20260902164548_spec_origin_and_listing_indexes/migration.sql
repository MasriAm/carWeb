-- CreateEnum
CREATE TYPE "SpecOrigin" AS ENUM ('GCC', 'US', 'EU', 'KOREAN', 'JAPANESE', 'OTHER');

-- DropIndex
DROP INDEX "Vehicle_bodyType_idx";

-- DropIndex
DROP INDEX "Vehicle_brand_idx";

-- DropIndex
DROP INDEX "Vehicle_condition_idx";

-- DropIndex
DROP INDEX "Vehicle_fuelType_idx";

-- DropIndex
DROP INDEX "Vehicle_isPromoted_idx";

-- DropIndex
DROP INDEX "Vehicle_price_idx";

-- DropIndex
DROP INDEX "Vehicle_productionYear_idx";

-- DropIndex
DROP INDEX "Vehicle_status_idx";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "specOrigin" "SpecOrigin";

-- CreateIndex
CREATE INDEX "Vehicle_status_publicationDate_idx" ON "Vehicle"("status", "publicationDate" DESC);

-- CreateIndex
CREATE INDEX "Vehicle_status_brand_publicationDate_idx" ON "Vehicle"("status", "brand", "publicationDate" DESC);

-- CreateIndex
CREATE INDEX "Vehicle_status_price_idx" ON "Vehicle"("status", "price");

-- CreateIndex
CREATE INDEX "Vehicle_status_productionYear_idx" ON "Vehicle"("status", "productionYear" DESC);

-- CreateIndex
CREATE INDEX "Vehicle_status_mileageKm_idx" ON "Vehicle"("status", "mileageKm");

-- CreateIndex
CREATE INDEX "Vehicle_status_bodyType_publicationDate_idx" ON "Vehicle"("status", "bodyType", "publicationDate" DESC);

-- CreateIndex
CREATE INDEX "Vehicle_status_isPromoted_publicationDate_idx" ON "Vehicle"("status", "isPromoted", "publicationDate" DESC);
