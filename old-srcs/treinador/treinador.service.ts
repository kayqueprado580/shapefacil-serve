import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { Prisma } from '@prisma/client';
import { Treinador } from './entities/treinador.entity';
import { TreinadorCreateDTO } from './dto/treinadorCreate.dto';
import { TreinadorEditDTO } from './dto/treinadorEdit.dto';
import { getUserByToken } from '../util/database.utils';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { appendStudent, removeStudent } from '../util/tractatives-array.utils';

@Injectable()
export class TreinadorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    skip: number,
    take: number,
    orderBy: string,
    name: string,
    usuario: number,
  ) {
    if (!usuario || usuario === 0) {
      throw new BadRequestException('Parâmetros não foram passados.');
    }
    let usuarioIds: number[] = [];
    if (name && name !== '') {
      const usuarios = await this.prisma.usuario.findMany({
        where: {
          nome: {
            contains: name.toLowerCase(),
          },
        },
      });
      usuarioIds = usuarios.map((u) => u.id);
      if (usuarioIds.length < 1)
        throw new BadRequestException(
          `Nome: ${name} não foi encontrado em nossa base de dados.`,
        );
    }

    const data: Treinador[] = await this.prisma.treinador.findMany({
      skip: skip || 0,
      take: take || 20,
      orderBy: {
        createdAt: orderBy?.toLowerCase() === 'asc' ? 'asc' : 'desc',
      },
      where: {
        usrCriouId: usuario,
        usuarioId: usuarioIds.length > 0 ? { in: usuarioIds } : undefined,
      },
    });
    if (usuarioIds.length === 0) {
      usuarioIds = data.map((n) => n.usuarioId);
    }
    const usuarios = await this.prisma.usuario.findMany({
      where: {
        id: { in: usuarioIds },
      },
    });
    const result = data.map((treinador) => ({
      ...treinador,
      usuario:
        usuarios.find((usuario) => usuario.id === treinador.usuarioId) || null,
    }));
    return result;
  }

  async findOne(id: number) {
    return await this.prisma.treinador.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async create(
    treinadorDTO: TreinadorCreateDTO,
    usuarioId: number,
  ): Promise<Treinador> {
    const usuario: Usuario | null = await getUserByToken(usuarioId);
    if (usuario.perfil.toLowerCase() !== 'administrador')
      throw new BadRequestException('Sem permissão para a criação.');

    const data: Prisma.TreinadorCreateInput = {
      ...treinadorDTO,
      alunos: JSON.stringify([]),
      usrCriouId: usuarioId,
    };

    return await this.prisma.treinador.create({ data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.treinador.delete({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    usuarioId: number,
    treinadorDTO: TreinadorEditDTO,
  ): Promise<Treinador> {
    const treinadorBase = await this.findOne(id);
    if (!treinadorDTO.usuarioId)
      treinadorDTO.usuarioId = treinadorBase.usuarioId;
    if (!treinadorDTO.alunos) treinadorDTO.alunos = treinadorBase.alunos;

    const usuario: Usuario | null = await getUserByToken(usuarioId);
    if (usuario.perfil.toLowerCase() !== 'administrador')
      throw new BadRequestException('Sem permissão para a edição.');

    const data: Prisma.TreinadorUpdateInput = {
      ...treinadorDTO,
      alunos: JSON.stringify(treinadorDTO.alunos),
    };

    return await this.prisma.treinador.update({
      data,
      where: {
        id,
      },
    });
  }

  async appendOrRemoveStudent(
    id: number,
    usuarioId: number,
    treinadorDTO: TreinadorEditDTO,
    remove?: boolean,
  ): Promise<Treinador> {
    const base = await this.findOne(id);
    if (!treinadorDTO.usuarioId) treinadorDTO.usuarioId = base.usuarioId;
    if (!treinadorDTO.alunos) treinadorDTO.alunos = base.alunos;

    const alunosBase = base.alunos ? base.alunos.split(',') : [];

    const alunos =
      typeof treinadorDTO.alunos === 'number'
        ? `${treinadorDTO.alunos}`
        : treinadorDTO.alunos;

    const alunosNovos = Array.isArray(alunos) ? alunos : alunos.split(',');
    const alunosString = remove
      ? removeStudent(alunosNovos, alunosBase)
      : appendStudent(alunosNovos, alunosBase);

    const usuario: Usuario | null = await getUserByToken(usuarioId);
    if (usuario.perfil.toLowerCase() !== 'administrador')
      throw new BadRequestException('Sem permissão para a edição.');

    const data: Prisma.NutricionistaUpdateInput = {
      ...treinadorDTO,
      alunos: alunosString,
    };

    return await this.prisma.treinador.update({
      data,
      where: {
        id,
      },
    });
  }
}
