import { Treinador } from '../entities/treinador.entity';
import { IsOptional } from 'class-validator';

export class TreinadorCreateDTO extends Treinador {
  @IsOptional()
  usuarioId?: number;
  @IsOptional()
  usrCriouId?: number;
  @IsOptional()
  alunos?: string | string[];
}
