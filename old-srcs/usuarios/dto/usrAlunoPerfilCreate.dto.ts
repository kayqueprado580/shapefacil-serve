import { AlunoCreateDTO } from '../../aluno/dto/alunoCreate.dto';
import { PerfilCreateDTO } from '../../perfil/dto/perfilCreate.dto';
import { UsuarioCreateDTO } from './usuarioCreate.dto';

export class CreateUserWithProfileAndApprendiceDTO {
  usuario: UsuarioCreateDTO;
  aluno: AlunoCreateDTO;
  perfilAcesso: PerfilCreateDTO;
}
