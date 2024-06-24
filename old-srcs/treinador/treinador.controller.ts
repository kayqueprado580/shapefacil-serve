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
import { TreinadorService } from './treinador.service';
import { TreinadorCreateDTO } from './dto/treinadorCreate.dto';
import { TreinadorEditDTO } from './dto/treinadorEdit.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('treinador')
export class TreinadorController {
  constructor(private readonly treinadorService: TreinadorService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('orderBy') orderBy: string,
    @Query('name') name: string,
    @Req() req: any,
  ) {
    const id = parseInt(req.user.sub, 10);
    const skp = parseInt(skip, 10);
    const tk = parseInt(take, 10);
    try {
      return await this.treinadorService.findAll(skp, tk, orderBy, name, id);
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
      return await this.treinadorService.findOne(+id);
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
  async create(@Body() data: TreinadorCreateDTO, @Req() req: any) {
    const id = parseInt(req.user.sub, 10);
    try {
      return await this.treinadorService.create(data, id);
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
      await this.treinadorService.remove(+id);
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
    @Body() data: TreinadorEditDTO,
    @Req() req: any,
  ) {
    const idCriador = parseInt(req.user.sub, 10);
    try {
      return await this.treinadorService.update(+id, idCriador, data);
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
  @Patch('incluir-aluno/:id')
  async includeStudent(
    @Param('id') id: string,
    @Body() data: TreinadorEditDTO,
    @Req() req: any,
  ) {
    const idCriador = parseInt(req.user.sub, 10);
    try {
      return await this.treinadorService.appendOrRemoveStudent(
        +id,
        idCriador,
        data,
        false,
      );
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
  @Patch('remover-aluno/:id')
  async removeStudent(
    @Param('id') id: string,
    @Body() data: TreinadorEditDTO,
    @Req() req: any,
  ) {
    const idCriador = parseInt(req.user.sub, 10);
    try {
      return await this.treinadorService.appendOrRemoveStudent(
        +id,
        idCriador,
        data,
        true,
      );
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
