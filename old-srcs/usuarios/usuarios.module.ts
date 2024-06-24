import { UsuarioController } from './usuarios.controller';
import { UsuarioService } from './usuarios.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { PerfilService } from '../perfil/perfil.service';
import { NutricionistaService } from '../nutricionista/nutricionista.service';
import { TreinadorService } from '../treinador/treinador.service';
import { AlunoService } from 'src/aluno/aluno.service';

@Module({
  imports: [],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    PrismaService,
    PerfilService,
    NutricionistaService,
    TreinadorService,
    AlunoService,
  ],
  exports: [UsuarioService],
})
export class UsuariosModule {}
