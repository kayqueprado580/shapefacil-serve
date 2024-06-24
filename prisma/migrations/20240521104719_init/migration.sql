-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "perfil_acesso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "perfil" TEXT NOT NULL,
    "acessoJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "perfil_acesso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "especialista" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "usrCriouId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "alunosJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "especialista_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aluno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "especialistaId" INTEGER NOT NULL,
    "usrCriouId" INTEGER NOT NULL,
    "peso" TEXT NOT NULL,
    "altura" TEXT NOT NULL,
    "porcGordura" TEXT NOT NULL,
    "porcMassaMagra" TEXT NOT NULL,
    "medidas" TEXT NOT NULL,
    "alunosJson" TEXT NOT NULL,
    "dataAvaliacao" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "aluno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "aluno_especialistaId_fkey" FOREIGN KEY ("especialistaId") REFERENCES "especialista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historico_aluno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alunoId" INTEGER NOT NULL,
    "especialistaId" INTEGER NOT NULL,
    "peso" TEXT NOT NULL,
    "altura" TEXT NOT NULL,
    "porcGordura" TEXT NOT NULL,
    "porcMassaMagra" TEXT NOT NULL,
    "medidas" TEXT NOT NULL,
    "alunosJson" TEXT NOT NULL,
    "dataAvaliacao" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "historico_aluno_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "historico_aluno_especialistaId_fkey" FOREIGN KEY ("especialistaId") REFERENCES "especialista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dieta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "especialistaId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "refeicoesJson" TEXT NOT NULL,
    "totalCalorias" TEXT NOT NULL,
    "totalProteinas" TEXT NOT NULL,
    "totalGordura" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dieta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "dieta_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "dieta_especialistaId_fkey" FOREIGN KEY ("especialistaId") REFERENCES "especialista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "treino" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "especialistaId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "PeriodoTreino" TEXT NOT NULL,
    "exerciciosJson" TEXT NOT NULL,
    "intensidade" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "treino_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "treino_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "treino_especialistaId_fkey" FOREIGN KEY ("especialistaId") REFERENCES "especialista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "avaliacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "especialistaId" INTEGER NOT NULL,
    "dietaId" INTEGER NOT NULL,
    "treinoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "avaliacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "avaliacao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "avaliacao_especialistaId_fkey" FOREIGN KEY ("especialistaId") REFERENCES "especialista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "avaliacao_dietaId_fkey" FOREIGN KEY ("dietaId") REFERENCES "dieta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "avaliacao_treinoId_fkey" FOREIGN KEY ("treinoId") REFERENCES "treino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usuario_key" ON "usuario"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_acesso_usuarioId_key" ON "perfil_acesso"("usuarioId");
