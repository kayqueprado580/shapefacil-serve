import { Perfil } from './../perfil/entities/perfil.entity';
import { Aluno } from './../aluno/entities/aluno.entity';
import { NutricionistaCreateDTO } from './../nutricionista/dto/nutricionistaCreate.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../lib/prisma.service';
import { Prisma } from '@prisma/client';
import { Usuario } from './entities/usuario.entity';
import { UsuarioCreateDTO } from './dto/usuarioCreate.dto';
import { checkIfExists } from '../util/database.utils';
import { UsuarioEditDTO } from './dto/usuarioEdit.dto';
import { hasChanged } from '../util/change-detector.utils';
import { PerfilService } from '../perfil/perfil.service';
import { PerfilCreateDTO } from '../perfil/dto/perfilCreate.dto';
import { CreateUserWithProfileDTO } from './dto/usrPerfilCreate.dto';
import { NutricionistaService } from '../nutricionista/nutricionista.service';
import { TreinadorCreateDTO } from '../treinador/dto/treinadorCreate.dto';
import { TreinadorService } from '../treinador/treinador.service';
import { AlunoCreateDTO } from '../aluno/dto/alunoCreate.dto';
import { AlunoService } from '../aluno/aluno.service';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly perfilService: PerfilService,
    private readonly nutricionistaService: NutricionistaService,
    private readonly treinadorService: TreinadorService,
    private readonly alunoService: AlunoService,
  ) {}

  async findAll(skip: number, take: number, orderBy: string, id: number) {
    const users: Usuario[] = await this.prisma.usuario.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 20,
      orderBy: {
        createdAt: orderBy
          ? orderBy.toLowerCase() === 'asc'
            ? 'asc'
            : 'desc'
          : 'desc',
      },
      where: {},
    });

    return {
      ...users,
      perfil_acesso: await this.perfilService.findAll(id, id),
    };
  }

  async findOne(id: string) {
    const usuario: Usuario = await this.prisma.usuario.findUniqueOrThrow({
      where: {
        uid: id,
      },
    });

    const perfil_acesso: Perfil = await this.perfilService.findOneByUser(
      usuario.id,
    );
    return {
      ...usuario,
      perfil_acesso: perfil_acesso,
    };
  }

  async findOneByUser(usuario: string) {
    return await this.prisma.usuario.findUniqueOrThrow({
      where: {
        usuario,
      },
    });
  }

  async create(
    bodyDTO: CreateUserWithProfileDTO,
    idUsuario: number,
  ): Promise<CreateUserWithProfileDTO> {
    const usuarioDTO: UsuarioCreateDTO = bodyDTO.usuario;
    const perfilDTO: PerfilCreateDTO = bodyDTO.perfilAcesso;
    const alunoDTO: AlunoCreateDTO = bodyDTO.aluno;
    const emailExists = await checkIfExists(
      'usuario',
      'email',
      usuarioDTO.email,
    );
    if (emailExists)
      throw new BadRequestException('Já existe um usuário com este email.');

    const usernameExists = await checkIfExists(
      'usuario',
      'usuario',
      usuarioDTO.usuario,
    );
    if (usernameExists) throw new NotFoundException('Usuário já existe!');

    const hash = await bcrypt.hash(usuarioDTO.senha, 10);
    const data: Prisma.UsuarioCreateInput = {
      ...usuarioDTO,
      nome: usuarioDTO.nome.toLowerCase(),
      senha: hash,
    };
    const createdUser = await this.prisma.usuario.create({ data });
    const usuarioNovo = createdUser.id;

    if (!perfilDTO.acessoJson)
      throw new BadRequestException('Necessário o json de acesso');
    if (!perfilDTO.perfil) throw new BadRequestException('Inserir o perfil');

    const dataCreatePerfil = {
      ...perfilDTO,
      acessoJson: JSON.stringify(perfilDTO.acessoJson),
      usuarioId: usuarioNovo,
    };
    const createdPerfil = await this.perfilService.create(
      dataCreatePerfil,
      idUsuario,
    );

    if (createdPerfil.perfil.toLocaleLowerCase() === 'nutricionista')
      this.criarNutricionista(usuarioNovo, idUsuario);

    if (createdPerfil.perfil.toLocaleLowerCase() === 'treinador')
      this.criarTreinador(usuarioNovo, idUsuario);

    if (createdPerfil.perfil.toLocaleLowerCase() === 'aluno')
      this.criarAluno(usuarioNovo, idUsuario, alunoDTO);

    return {
      usuario: { ...createdUser, senha: undefined },
      perfilAcesso: createdPerfil,
    };
  }

  async criarNutricionista(idUsuario: number, usuarioCriacao: number) {
    const dados: NutricionistaCreateDTO = { usuarioId: idUsuario };
    return await this.nutricionistaService.create(dados, usuarioCriacao);
  }

  async criarTreinador(idUsuario: number, usuarioCriacao: number) {
    const dados: TreinadorCreateDTO = { usuarioId: idUsuario };
    return await this.treinadorService.create(dados, usuarioCriacao);
  }

  async criarAluno(
    usuarioID: number,
    usuarioCriacao: number,
    alunoDTO: AlunoCreateDTO,
  ) {
    const dados: AlunoCreateDTO = {
      ...alunoDTO,
      usuarioId: usuarioID,
      usrCriouId: usuarioCriacao,
    };
    return await this.alunoService.create(dados, usuarioCriacao);
  }

  async remove(id: number, idUsuarioLogado: number) {
    const usuario: Usuario = await this.prisma.usuario.findUniqueOrThrow({
      where: { id },
    });

    const usuarioLogado: Usuario = await this.prisma.usuario.findUniqueOrThrow({
      where: { id: idUsuarioLogado },
    });

    if (usuarioLogado.perfil.toLocaleLowerCase() === 'administrador') {
      if (usuario.perfil.toLocaleLowerCase() === 'nutricionista') {
        await this.prisma.nutricionista.delete({
          where: {
            usuarioId: usuario.id,
          },
        });
      }
      if (usuario.perfil.toLocaleLowerCase() === 'treinador') {
        await this.prisma.treinador.delete({
          where: {
            usuarioId: usuario.id,
          },
        });
      }
      if (usuario.perfil.toLocaleLowerCase() === 'aluno')
        await this.removerAluno(usuario.id);

      const perfil: Perfil[] = await this.perfilService.findAll(usuario.id, 0);
      await this.perfilService.remove(perfil[0].id);
    }
    return await this.prisma.usuario.delete({
      where: {
        id,
      },
    });
  }

  async removerAluno(idUsuarioAluno: number) {
    const aluno: Aluno = await this.prisma.aluno.findUniqueOrThrow({
      where: {
        usuarioId: idUsuarioAluno,
      },
    });
    try {
      await this.prisma.historicoAluno.deleteMany({
        where: {
          alunoId: aluno.id,
        },
      });

      return await this.prisma.aluno.delete({
        where: {
          id: aluno.id,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, userDTO: UsuarioEditDTO): Promise<Usuario> {
    const userBase = await this.prisma.usuario.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const usernameHasChanged = hasChanged(userBase.usuario, userDTO.usuario);
    if (usernameHasChanged) {
      const usernameExists = await checkIfExists(
        'usuario',
        'usuario',
        userDTO.usuario,
      );
      if (usernameExists) throw new BadRequestException('Usuário já existe.');
    }

    const emailHasChanged = hasChanged(userBase.email, userDTO.email);
    if (emailHasChanged) {
      const emailExists = await checkIfExists(
        'usuario',
        'email',
        userDTO.email,
      );
      if (emailExists) {
        throw new BadRequestException('Já existe um usuário com este email.');
      }
    }

    if (!userDTO.nome) userDTO.nome = userBase.nome;
    if (!userDTO.contato) userDTO.contato = userBase.contato;
    if (!userDTO.documento) userDTO.documento = userBase.documento;
    if (!userDTO.perfil) userDTO.perfil = userBase.perfil;
    if (!userDTO.email) userDTO.email = userBase.email;
    if (!userDTO.usuario) userDTO.usuario = userBase.usuario;
    if (!userDTO.senha) userDTO.senha = userBase.senha;

    const data: Prisma.UsuarioUpdateInput = {
      ...userDTO,
    };

    const updatedUser = await this.prisma.usuario.update({
      data,
      where: {
        id,
      },
    });

    return {
      ...updatedUser,
      senha: undefined,
    };
  }

  async updatePassword(id: number, userDTO: UsuarioEditDTO): Promise<Usuario> {
    const base = await this.prisma.usuario.findUniqueOrThrow({ where: { id } });
    const isPasswordSame = await this.comparePwd(userDTO.senha, base.senha);
    if (isPasswordSame)
      throw new BadRequestException(
        'Nova senha, igual a antiga. Por favor, troque de senha!',
      );

    const newPasswordHash = await bcrypt.hash(userDTO.senha, 10);
    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: {
        senha: newPasswordHash,
      },
    });

    return {
      ...updatedUser,
      senha: undefined,
    };
  }

  async comparePwd(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
