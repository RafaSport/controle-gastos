-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('ADMIN', 'COMPRADOR');

-- CreateEnum
CREATE TYPE "Cartao" AS ENUM ('NUBANK', 'INTER', 'HIPER', 'ITAU');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "papel" "Papel" NOT NULL DEFAULT 'COMPRADOR',
    "primeiroLogin" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cartao" "Cartao" NOT NULL,
    "descricao" TEXT NOT NULL,
    "mesCompra" INTEGER NOT NULL,
    "anoCompra" INTEGER NOT NULL,
    "mesInicio" INTEGER NOT NULL,
    "anoInicio" INTEGER NOT NULL,
    "qtdParcelas" INTEGER NOT NULL,
    "mesFinal" INTEGER NOT NULL,
    "anoFinal" INTEGER NOT NULL,
    "valorParcela" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MesFechado" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "totalPago" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dividaAnterior" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "MesFechado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_login_key" ON "Usuario"("login");

-- CreateIndex
CREATE UNIQUE INDEX "MesFechado_usuarioId_mes_ano_key" ON "MesFechado"("usuarioId", "mes", "ano");

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MesFechado" ADD CONSTRAINT "MesFechado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
