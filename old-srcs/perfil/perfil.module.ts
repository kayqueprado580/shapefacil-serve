import { PrismaService } from '../lib/prisma.service';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PerfilController],
  providers: [PerfilService, PrismaService],
  exports: [PerfilService],
})
export class PerfilModule {}
