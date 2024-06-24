import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { Prisma } from '@prisma/client';
import { Aluno } from './entities/aluno.entity';
import { HistoricoAluno } from './entities/historicoAluno.entity';
import { AlunoCreateDTO } from './dto/alunoCreate.dto';
import { AlunoEditDTO } from './dto/alunoEdit.dto';
import { HistoricoAlunoCreateDTO } from './dto/historicoAlunoCreate.dto';
import { getUserByToken } from '../util/database.utils';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AlunoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(usuarioId: number) {
    let condicao = {};
    if (!usuarioId && usuarioId === 0)
      throw new BadRequestException('Necessário usuário ID');

    const usuario: Usuario | null = await getUserByToken(usuarioId);
    switch (usuario.perfil.toLowerCase()) {
      case 'administrador':
        condicao = { usrCriouId: usuario.id };
        break;
      case 'treinador':
        condicao = { treinadorId: usuario.id };
        break;
      case 'nutricionista':
        condicao = { nutricionistaId: usuario.id };
        break;
      default:
        throw new BadRequestException('Sem permissão...');
    }

    const data: Aluno[] = await this.prisma.aluno.findMany({
      where: condicao,
    });
    return data;
  }

  async findOne(id: number) {
    return await this.prisma.aluno.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async create(alunoDTO: AlunoCreateDTO, usuarioId: number): Promise<Aluno> {
    const usuario: Usuario | null = await getUserByToken(usuarioId);
    if (usuario.perfil.toLowerCase() !== 'administrador')
      throw new BadRequestException('Sem permissão...');

    const dataAvaliacao = new Date();
    const data: Prisma.AlunoCreateInput = {
      ...alunoDTO,
      medidas: JSON.stringify(alunoDTO.medidas),
      dataAvaliacao,
      usrCriouId: usuarioId,
    };
    try {
      const aluno: Aluno = await this.prisma.aluno.create({ data });
      if (
        alunoDTO.altura ||
        alunoDTO.medidas ||
        alunoDTO.peso ||
        alunoDTO.porcGordura ||
        alunoDTO.porcMassaMagra
      ) {
        const historicoAlunoDTO: HistoricoAlunoCreateDTO = {
          alunoId: aluno.id,
          treinadorId: alunoDTO.treinadorId,
          nutricionistaId: alunoDTO.nutricionistaId,
          peso: alunoDTO.peso,
          altura: alunoDTO.altura,
          porcGordura: alunoDTO.porcGordura,
          porcMassaMagra: alunoDTO.porcMassaMagra,
          medidas: JSON.stringify(alunoDTO.medidas),
          dataAvaliacao,
        };
        await this.createHistory(historicoAlunoDTO);
        return aluno;
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createHistory(
    historicoAlunoDTO: HistoricoAlunoCreateDTO,
  ): Promise<HistoricoAluno> {
    const data: Prisma.HistoricoAlunoCreateInput = {
      ...historicoAlunoDTO,
      dataAvaliacao: new Date(),
    };
    return await this.prisma.historicoAluno.create({ data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.aluno.delete({
      where: {
        id,
      },
    });
  }
  async update(
    id: number,
    usuarioId: number,
    alunoDTO: AlunoEditDTO,
  ): Promise<Aluno> {
    const alunoBase = await this.findOne(id);
    if (!alunoDTO.usuarioId) alunoDTO.usuarioId = alunoBase.usuarioId;
    // if (!alunoDTO.alunos) alunoDTO.alunos = alunoBase.alunos;

    const usuario: Usuario | null = await getUserByToken(usuarioId);
    if (usuario.perfil.toLowerCase() !== 'administrador')
      throw new BadRequestException('Sem permissão para a edição.');

    const data: Prisma.AlunoUpdateInput = {
      ...alunoDTO,
      // alunos: JSON.stringify(alunoDTO.alunos),
    };

    return await this.prisma.aluno.update({
      data,
      where: {
        id,
      },
    });
  }
}
