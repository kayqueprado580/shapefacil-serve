import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PrismaService } from '../lib/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioService } from '../usuarios/usuarios.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PerfilService } from '../perfil/perfil.service';
import { NutricionistaService } from '../nutricionista/nutricionista.service';
import { TreinadorService } from 'src/treinador/treinador.service';
import { AlunoService } from 'src/aluno/aluno.service';

@Module({
  imports: [
    UsuariosModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300000s' },
    }),
  ],
  providers: [
    AuthService,
    UsuarioService,
    PrismaService,
    PerfilService,
    NutricionistaService,
    TreinadorService,
    AlunoService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
