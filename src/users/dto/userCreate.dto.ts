import { Usuario } from '../entities/user.entity';
import { IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';

export class UserCreateDTO extends Usuario {
  @IsNotEmpty()
  @Length(3, 10)
  nome: string;

  contato?: string;
  documento?: string;

  @IsNotEmpty()
  perfil: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(3, 10)
  usuario: string;

  @IsNotEmpty()
  @Length(4, 20)
  @Matches(/^(?=.*\d)(?=.*[a-z]).{4,}$/, {
    message:
      'Password must be at least 4 characters long and include at least one lowercase letter and one numeric digit.',
  })
  senha: string;
}
