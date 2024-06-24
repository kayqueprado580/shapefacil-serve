import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, pass) {
    const user = await this.userService.findOneByUser(username);

    if (user) {
      const isPasswordValid = await this.userService.comparePwd(
        pass,
        user.senha,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Password provided is incorrect.');
      }
      const payload = { sub: user.id, username: user.usuario };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    throw new UnauthorizedException(
      'Username or password provided is incorrect.',
    );
  }
}
