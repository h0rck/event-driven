-- DropForeignKey
ALTER TABLE "alternativas" DROP CONSTRAINT "alternativas_questaoId_fkey";

-- AddForeignKey
ALTER TABLE "alternativas" ADD CONSTRAINT "alternativas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
