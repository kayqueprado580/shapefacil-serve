import {
  Controller,
  Get,
  Req,
  Param,
  HttpException,
  HttpStatus,
  // Query,
  Post,
  Body,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AlunoCreateDTO } from './dto/alunoCreate.dto';
import { AlunoEditDTO } from './dto/alunoEdit.dto';
// import { HistoricoAlunoCreateDTO } from './dto/historicoAlunoCreate.dto';
// import { HistoricoAlunoEditDTO } from './dto/HistoricoAlunoEdit.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('aluno')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const id = parseInt(req.user.sub, 10);
    try {
      return await this.alunoService.findAll(id);
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
      return await this.alunoService.findOne(+id);
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
  async create(@Body() data: AlunoCreateDTO, @Req() req: any) {
    const id = parseInt(req.user.sub, 10);
    try {
      return await this.alunoService.create(data, id);
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
      await this.alunoService.remove(+id);
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
    @Body() data: AlunoEditDTO,
    @Req() req: any,
  ) {
    const idCriador = parseInt(req.user.sub, 10);
    try {
      return await this.alunoService.update(+id, idCriador, data);
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
