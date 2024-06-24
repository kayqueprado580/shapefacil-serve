import {
  Controller,
  Get,
  Req,
  Param,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NutricionistaService } from './nutricionista.service';
import { NutricionistaCreateDTO } from './dto/nutricionistaCreate.dto';
import { NutricionistaEditDTO } from './dto/nutricionistaEdit.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('nutricionista')
export class NutricionistaController {
  constructor(private readonly nutricionistaService: NutricionistaService) {}

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
      return await this.nutricionistaService.findAll(
        skp,
        tk,
        orderBy,
        name,
        id,
      );
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
      return await this.nutricionistaService.findOne(+id);
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
  async create(@Body() data: NutricionistaCreateDTO, @Req() req: any) {
    const id = parseInt(req.user.sub, 10);
    try {
      return await this.nutricionistaService.create(data, id);
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
      await this.nutricionistaService.remove(+id);
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
  @Patch('incluir-aluno/:id')
  async includeStudent(
    @Param('id') id: string,
    @Body() data: NutricionistaEditDTO,
    @Req() req: any,
  ) {
    const idCriador = parseInt(req.user.sub, 10);
    try {
      return await this.nutricionistaService.appendOrRemoveStudent(
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
    @Body() data: NutricionistaEditDTO,
    @Req() req: any,
  ) {
    const idCriador = parseInt(req.user.sub, 10);
    try {
      return await this.nutricionistaService.appendOrRemoveStudent(
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
