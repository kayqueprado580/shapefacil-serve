import { Nutricionista } from '../entities/nutricionista.entity';
import { IsOptional } from 'class-validator';

export class NutricionistaCreateDTO extends Nutricionista {
  @IsOptional()
  usuarioId?: number;
  @IsOptional()
  usrCriouId?: number;
  @IsOptional()
  alunos?: string | string[];
}
