-- DropForeignKey
ALTER TABLE "questoe_conteudos" DROP CONSTRAINT "questoe_conteudos_questaoId_fkey";

-- AddForeignKey
ALTER TABLE "questoe_conteudos" ADD CONSTRAINT "questoe_conteudos_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
