ALTER TABLE "Corrida" ADD COLUMN "mesReferencia" INTEGER;
ALTER TABLE "Corrida" ADD COLUMN "anoReferencia" INTEGER;

UPDATE "Corrida"
SET
    "mesReferencia" = EXTRACT(MONTH FROM "data")::INTEGER,
    "anoReferencia" = EXTRACT(YEAR FROM "data")::INTEGER;

ALTER TABLE "Corrida" ALTER COLUMN "mesReferencia" SET NOT NULL;
ALTER TABLE "Corrida" ALTER COLUMN "anoReferencia" SET NOT NULL;
