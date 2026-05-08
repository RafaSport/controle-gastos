-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "usaUber" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Corrida" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Corrida_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
