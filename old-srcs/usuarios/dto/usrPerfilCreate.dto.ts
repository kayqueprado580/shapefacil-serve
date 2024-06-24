import { PerfilCreateDTO } from '../../perfil/dto/perfilCreate.dto';
import { UsuarioCreateDTO } from './usuarioCreate.dto';
import { AlunoCreateDTO } from '../../aluno/dto/alunoCreate.dto';

export class CreateUserWithProfileDTO {
  usuario: UsuarioCreateDTO;
  perfilAcesso: PerfilCreateDTO;
  aluno?: AlunoCreateDTO;
}
