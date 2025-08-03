-- CreateEnum
CREATE TYPE "public"."LifeSpan" AS ENUM ('None', 'Microbial', 'Intelligent');

-- CreateTable
CREATE TABLE "public"."Prime" (
    "index" INTEGER NOT NULL,
    "prime" BIGINT NOT NULL,

    CONSTRAINT "Prime_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "public"."PlanetaryScans" (
    "scan_id" TEXT NOT NULL,
    "planet_name" TEXT NOT NULL,
    "surface_temp_k" INTEGER NOT NULL,
    "life_span" "public"."LifeSpan" NOT NULL,

    CONSTRAINT "PlanetaryScans_pkey" PRIMARY KEY ("scan_id")
);

-- CreateTable
CREATE TABLE "public"."CyberThreats" (
    "report_id" TEXT NOT NULL,
    "threat_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CyberThreats_pkey" PRIMARY KEY ("report_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prime_index_key" ON "public"."Prime"("index");

-- CreateIndex
CREATE UNIQUE INDEX "Prime_prime_key" ON "public"."Prime"("prime");

-- CreateIndex
CREATE UNIQUE INDEX "PlanetaryScans_scan_id_key" ON "public"."PlanetaryScans"("scan_id");

-- CreateIndex
CREATE UNIQUE INDEX "CyberThreats_report_id_key" ON "public"."CyberThreats"("report_id");
