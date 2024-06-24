import {
  Controller,
  Get,
  Req,
  Param,
  HttpException,
  HttpStatus,
  Query,
  Post,
  Body,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuarios.service';
import { UsuarioEditDTO } from './dto/usuarioEdit.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserWithProfileDTO } from './dto/usrPerfilCreate.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('orderBy') orderBy: string,
    @Req() req: any,
  ) {
    const id = parseInt(req.user.sub, 10);
    const skp = parseInt(skip, 10);
    const tk = parseInt(take, 10);

    try {
      return await this.usuarioService.findAll(skp, tk, orderBy, id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') uuidParameter: string) {
    try {
      return await this.usuarioService.findOne(uuidParameter);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body()
    data: CreateUserWithProfileDTO,
    @Req() req: any,
  ) {
    const idUsuario = parseInt(req.user.sub, 10);
    try {
      return await this.usuarioService.create(data, idUsuario);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const idBuscar = parseInt(id, 10);
    const idUsuario = parseInt(req.user.sub, 10);
    try {
      await this.usuarioService.remove(idBuscar, idUsuario);
      return { message: 'successfully removed' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() userDTO: UsuarioEditDTO) {
    try {
      return await this.usuarioService.update(+id, userDTO);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch('trocar-senha/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() userDTO: UsuarioEditDTO,
  ) {
    try {
      return await this.usuarioService.updatePassword(+id, userDTO);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
