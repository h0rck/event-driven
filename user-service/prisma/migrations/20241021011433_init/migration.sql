-- CreateEnum
CREATE TYPE "questaoConteudosType" AS ENUM ('TEXTO', 'IMAGEM');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas" (
    "id" SERIAL NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "alternativaId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "usuarioId" INTEGER,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questoes" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "fonte" TEXT,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "questoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questoe_conteudos" (
    "id" SERIAL NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "tipo" "questaoConteudosType" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "conteudo" TEXT,
    "imagem" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER,

    CONSTRAINT "questoe_conteudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternativas" (
    "id" SERIAL NOT NULL,
    "alternativa" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "imagem" BYTEA,
    "questaoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "alternativas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alternativas_corretas" (
    "alternativaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alternativas_corretas_questaoId_key" ON "alternativas_corretas"("questaoId");

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_alternativaId_fkey" FOREIGN KEY ("alternativaId") REFERENCES "alternativas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questoes" ADD CONSTRAINT "questoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questoe_conteudos" ADD CONSTRAINT "questoe_conteudos_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questoe_conteudos" ADD CONSTRAINT "questoe_conteudos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternativas" ADD CONSTRAINT "alternativas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternativas_corretas" ADD CONSTRAINT "alternativas_corretas_alternativaId_fkey" FOREIGN KEY ("alternativaId") REFERENCES "alternativas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alternativas_corretas" ADD CONSTRAINT "alternativas_corretas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
