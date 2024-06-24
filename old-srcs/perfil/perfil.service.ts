import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { Prisma } from '@prisma/client';
import { Perfil } from './entities/perfil.entity';
import { PerfilCreateDTO } from './dto/perfilCreate.dto';
import { PerfilEditDTO } from './dto/perfilEdit.dto';

@Injectable()
export class PerfilService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(usuario: number, usuarioCriado?: number) {
    let condicao = {};
    if (
      usuarioCriado &&
      typeof usuarioCriado !== 'string' &&
      usuarioCriado !== 0
    ) {
      condicao = { createdAtUser: usuarioCriado };
    } else if (usuario && typeof usuario !== 'string' && usuario !== 0) {
      condicao = { usuarioId: usuario };
    } else {
      throw new BadRequestException('Parâmetros não foram passados.');
    }

    const users: Perfil[] = await this.prisma.perfilAcesso.findMany({
      where: condicao,
    });

    return users;
  }

  async findOneByUser(id: number) {
    return await this.prisma.perfilAcesso.findUniqueOrThrow({
      where: {
        usuarioId: id,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.perfilAcesso.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async create(perfilDTO: PerfilCreateDTO, usuario: number): Promise<Perfil> {
    const data: Prisma.PerfilAcessoCreateInput = {
      ...perfilDTO,
      createdAtUser: usuario,
    };
    return await this.prisma.perfilAcesso.create({ data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.perfilAcesso.delete({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    usuario: number,
    perfilDTO: PerfilEditDTO,
  ): Promise<Perfil> {
    const perfilBase = await this.findOne(id);

    if (!perfilDTO.usuarioId) perfilDTO.usuarioId = perfilBase.usuarioId;
    if (!perfilDTO.perfil) perfilDTO.perfil = perfilBase.perfil;
    if (!perfilDTO.acessoJson) perfilDTO.acessoJson = perfilBase.acessoJson;

    const data: Prisma.PerfilAcessoUpdateInput = {
      ...perfilDTO,
      createdAtUser: usuario,
    };

    return await this.prisma.perfilAcesso.update({
      data,
      where: {
        id,
      },
    });
  }
}
