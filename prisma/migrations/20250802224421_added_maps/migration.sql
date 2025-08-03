/*
  Warnings:

  - You are about to drop the `CyberThreats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanetaryScans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prime` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."CyberThreats";

-- DropTable
DROP TABLE "public"."PlanetaryScans";

-- DropTable
DROP TABLE "public"."Prime";

-- CreateTable
CREATE TABLE "public"."primes" (
    "index" INTEGER NOT NULL,
    "prime" BIGINT NOT NULL,

    CONSTRAINT "primes_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "public"."planetary_scans" (
    "scan_id" TEXT NOT NULL,
    "planet_name" TEXT NOT NULL,
    "surface_temp_k" INTEGER NOT NULL,
    "life_span" "public"."LifeSpan" NOT NULL,

    CONSTRAINT "planetary_scans_pkey" PRIMARY KEY ("scan_id")
);

-- CreateTable
CREATE TABLE "public"."cyber_threats" (
    "report_id" TEXT NOT NULL,
    "threat_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cyber_threats_pkey" PRIMARY KEY ("report_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "primes_prime_key" ON "public"."primes"("prime");
