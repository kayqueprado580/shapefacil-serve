import { PrismaService } from '../lib/prisma.service';
import { AlunoController } from './aluno.controller';
import { AlunoService } from './aluno.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AlunoController],
  providers: [AlunoService, PrismaService],
  exports: [AlunoService],
})
export class AlunoModule {}
