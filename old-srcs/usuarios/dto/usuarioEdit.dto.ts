import { Usuario } from '../entities/usuario.entity';
import { IsNotEmpty, Length, IsOptional, Matches } from 'class-validator';

export class UsuarioEditDTO extends Usuario {
  nome: string;
  contato: string;
  documento: string;
  perfi1l: string;
  email: string;
  usuario: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(4, 20)
  @Matches(/^(?=.*\d)(?=.*[a-z]).{4,}$/, {
    message:
      'A senha deve conter pelo menos uma letra e um número, e ter no mínimo 4 caracteres.',
  })
  senha?: string;
}
