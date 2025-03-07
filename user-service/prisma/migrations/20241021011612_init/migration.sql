/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `questoe_conteudos` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `questoes` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `respostas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "questoe_conteudos" DROP CONSTRAINT "questoe_conteudos_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "questoes" DROP CONSTRAINT "questoes_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "respostas" DROP CONSTRAINT "respostas_usuarioId_fkey";

-- AlterTable
ALTER TABLE "questoe_conteudos" DROP COLUMN "usuarioId";

-- AlterTable
ALTER TABLE "questoes" DROP COLUMN "usuarioId";

-- AlterTable
ALTER TABLE "respostas" DROP COLUMN "usuarioId";
