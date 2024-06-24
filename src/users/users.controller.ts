import {
  Controller,
  Get,
  // Post,
  Req,
  // Body,
  // Patch,
  Param,
  // Delete,
  HttpException,
  HttpStatus,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { UserDTO } from './dto/userEdit.dto';
// import { UserCreateDTO } from './dto/userCreate.dto';
// import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('orderBy') orderBy: boolean,
    @Req() req: any,
  ) {
    const id = parseInt(req.user.sub, 10);
    const skp = parseInt(skip, 10);
    const tk = parseInt(take, 10);

    try {
      return await this.usersService.findAll(skp, tk, orderBy, id);
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

  // @Post()
  // async create(@Body() data: UserCreateDTO) {
  //   try {
  //     return await this.usersService.create(data);
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.FORBIDDEN,
  //         error: error.message,
  //       },
  //       HttpStatus.FORBIDDEN,
  //       {
  //         cause: error,
  //       },
  //     );
  //   }
  // }

  // @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(+id);
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

  // @UseGuards(AuthGuard)
  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() userDTO: UserDTO) {
  //   try {
  //     return await this.usersService.update(+id, userDTO);
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.FORBIDDEN,
  //         error: error.message,
  //       },
  //       HttpStatus.FORBIDDEN,
  //       {
  //         cause: error,
  //       },
  //     );
  //   }
  // }

  // @UseGuards(AuthGuard)
  // @Patch('password/:id')
  // async updatePassword(@Param('id') id: string, @Body() userDTO: UserDTO) {
  //   try {
  //     return await this.usersService.updatePassword(+id, userDTO);
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.FORBIDDEN,
  //         error: error.message,
  //       },
  //       HttpStatus.FORBIDDEN,
  //       {
  //         cause: error,
  //       },
  //     );
  //   }
  // }

  // @UseGuards(AuthGuard)
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   try {
  //     await this.usersService.remove(+id);
  //     return { message: 'successfully removed' };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         error: error.message,
  //       },
  //       HttpStatus.NOT_FOUND,
  //       {
  //         cause: error,
  //       },
  //     );
  //   }
  // }
}
