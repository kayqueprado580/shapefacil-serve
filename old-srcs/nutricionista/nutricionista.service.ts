import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { Prisma } from '@prisma/client';
import { Nutricionista } from './entities/nutricionista.entity';
import { NutricionistaCreateDTO } from './dto/nutricionistaCreate.dto';
import { NutricionistaEditDTO } from './dto/nutricionistaEdit.dto';
import { getUserByToken } from '../util/database.utils';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { appendStudent, removeStudent } from '../util/tractatives-array.utils';

@Injectable()
export class NutricionistaService {
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

    const data: Nutricionista[] = await this.prisma.nutricionista.findMany({
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
    const result = data.map((nutricionista) => ({
      ...nutricionista,
      usuario:
        usuarios.find((usuario) => usuario.id === nutricionista.usuarioId) ||
        null,
    }));
    return result;
  }

  async findOne(id: number) {
    return await this.prisma.nutricionista.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async create(
    nutricionistaDTO: NutricionistaCreateDTO,
    usuarioId: number,
  ): Promise<Nutricionista> {
    const usuario: Usuario | null = await getUserByToken(usuarioId);
    if (usuario.perfil.toLowerCase() !== 'administrador')
      throw new BadRequestException('Sem permissão para a criação.');

    const data: Prisma.NutricionistaCreateInput = {
      ...nutricionistaDTO,
      alunos: null,
      usrCriouId: usuarioId,
    };

    return await this.prisma.nutricionista.create({ data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.nutricionista.delete({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    usuarioId: number,
    nutricionistaDTO: NutricionistaEditDTO,
  ): Promise<Nutricionista> {
    const nutricionistaBase = await this.findOne(id);
    if (!nutricionistaDTO.usuarioId)
      nutricionistaDTO.usuarioId = nutricionistaBase.usuarioId;
    if (!nutricionistaDTO.alunos)
      nutricionistaDTO.alunos = nutricionistaBase.alunos;

    const usuario: Usuario | null = await getUserByToken(usuarioId);
    if (usuario.perfil.toLowerCase() !== 'administrador')
      throw new BadRequestException('Sem permissão para a edição.');

    const data: Prisma.NutricionistaUpdateInput = {
      ...nutricionistaDTO,
      alunos: JSON.stringify(nutricionistaDTO.alunos),
    };

    return await this.prisma.nutricionista.update({
      data,
      where: {
        id,
      },
    });
  }

  async appendOrRemoveStudent(
    id: number,
    usuarioId: number,
    nutricionistaDTO: NutricionistaEditDTO,
    remove?: boolean,
  ): Promise<Nutricionista> {
    const nutricionistaBase = await this.findOne(id);
    if (!nutricionistaDTO.usuarioId)
      nutricionistaDTO.usuarioId = nutricionistaBase.usuarioId;
    if (!nutricionistaDTO.alunos)
      nutricionistaDTO.alunos = nutricionistaBase.alunos;

    const alunosBase = nutricionistaBase.alunos
      ? nutricionistaBase.alunos.split(',')
      : [];

    const alunos =
      typeof nutricionistaDTO.alunos === 'number'
        ? `${nutricionistaDTO.alunos}`
        : nutricionistaDTO.alunos;

    const alunosNovos = Array.isArray(alunos) ? alunos : alunos.split(',');
    const alunosString = remove
      ? removeStudent(alunosNovos, alunosBase)
      : appendStudent(alunosNovos, alunosBase);

    const usuario: Usuario | null = await getUserByToken(usuarioId);
    if (usuario.perfil.toLowerCase() !== 'administrador')
      throw new BadRequestException('Sem permissão para a edição.');

    const data: Prisma.NutricionistaUpdateInput = {
      ...nutricionistaDTO,
      alunos: alunosString,
    };

    return await this.prisma.nutricionista.update({
      data,
      where: {
        id,
      },
    });
  }
}
