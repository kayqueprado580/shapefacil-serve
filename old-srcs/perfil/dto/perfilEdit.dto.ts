import { Perfil } from '../entities/perfil.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PerfilEditDTO extends Perfil {
  @IsOptional()
  usuarioId?: number;
  @IsNotEmpty()
  perfil: string;
  @IsNotEmpty()
  acessoJson: string;
  @IsOptional()
  createdAtUser?: number;
}
