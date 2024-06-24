import { PrismaService } from '../lib/prisma.service';
import { NutricionistaController } from './nutricionista.controller';
import { NutricionistaService } from './nutricionista.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [NutricionistaController],
  providers: [NutricionistaService, PrismaService],
  exports: [NutricionistaService],
})
export class NutricionistaModule {}
