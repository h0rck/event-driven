/*
  Warnings:

  - Changed the type of `tipo` on the `questoe_conteudos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestaoConteudoType" AS ENUM ('TEXTO', 'IMAGEM');

-- DropForeignKey
ALTER TABLE "questoe_conteudos" DROP CONSTRAINT "questoe_conteudos_questaoId_fkey";

-- AlterTable
ALTER TABLE "questoe_conteudos" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "QuestaoConteudoType" NOT NULL;

-- DropEnum
DROP TYPE "questaoConteudosType";

-- AddForeignKey
ALTER TABLE "questoe_conteudos" ADD CONSTRAINT "questoe_conteudos_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
