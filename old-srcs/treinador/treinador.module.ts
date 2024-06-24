import { PrismaService } from '../lib/prisma.service';
import { TreinadorController } from './treinador.controller';
import { TreinadorService } from './treinador.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TreinadorController],
  providers: [TreinadorService, PrismaService],
  exports: [TreinadorService],
})
export class TreinadorModule {}
