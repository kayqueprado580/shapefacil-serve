import { HistoricoAluno } from '../entities/historicoAluno.entity';
import { IsOptional } from 'class-validator';

export class HistoricoAlunoEditDTO extends HistoricoAluno {
  @IsOptional()
  alunoId?: number;
  @IsOptional()
  treinadorId?: number;
  @IsOptional()
  nutricionistaId?: number;
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
