import { Aluno } from '../entities/aluno.entity';
import { IsOptional } from 'class-validator';

export class AlunoEditDTO extends Aluno {
  @IsOptional()
  usuarioId?: number;
  @IsOptional()
  treinadorId?: number;
  @IsOptional()
  nutricionistaId?: number;
  @IsOptional()
  usrCriouId?: number;
  @IsOptional()
  peso?: string;
  @IsOptional()
  altura?: string;
  @IsOptional()
  porcGordura?: string;
  @IsOptional()
  porcMassaMagra?: string;
  @IsOptional()
  medidas?: string;
  @IsOptional()
  dataAvaliacao?: Date;
}
