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
import { PerfilService } from './perfil.service';
import { PerfilCreateDTO } from './dto/perfilCreate.dto';
import { PerfilEditDTO } from './dto/perfilEdit.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('criado') usuarioCriado: string, @Req() req: any) {
    const id = parseInt(req.user.sub, 10);
    const criado = parseInt(usuarioCriado, 10);

    try {
      return await this.perfilService.findAll(id, criado);
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
  async findOne(@Param('id') id: string) {
    try {
      return await this.perfilService.findOne(+id);
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
  async create(@Body() data: PerfilCreateDTO, @Req() req: any) {
    const id = parseInt(req.user.sub, 10);
    try {
      return await this.perfilService.create(data, id);
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
  async remove(@Param('id') id: string) {
    try {
      await this.perfilService.remove(+id);
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
  async update(
    @Param('id') id: string,
    @Body() data: PerfilEditDTO,
    @Req() req: any,
  ) {
    const idCriador = parseInt(req.user.sub, 10);
    try {
      return await this.perfilService.update(+id, idCriador, data);
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
