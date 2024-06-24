// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   HttpException,
//   HttpStatus,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import { UserAccessService } from './userAccess.service';
// import { UserAccessDTO } from './dto/userAccess.dto';
// import { AuthGuard } from '../auth/auth.guard';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly userAccessService: UserAccessService) {}

//   @Get()
//   async findAll() {
//     return await this.userAccessService.findAll();
//   }

//   @Post()
//   async create(@Body() data: UserAccessDTO) {
//     try {
//       return await this.userAccessService.create(data);
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.FORBIDDEN,
//           error: error.message,
//         },
//         HttpStatus.FORBIDDEN,
//         {
//           cause: error,
//         },
//       );
//     }
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     try {
//       return await this.userAccessService.findOne(+id);
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.NOT_FOUND,
//           error: error.message,
//         },
//         HttpStatus.NOT_FOUND,
//         {
//           cause: error,
//         },
//       );
//     }
//   }

//   @Patch(':id')
//   async update(@Param('id') id: string, @Body() data: UserAccessDTO) {
//     try {
//       return await this.userAccessService.update(+id, data);
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.FORBIDDEN,
//           error: error.message,
//         },
//         HttpStatus.FORBIDDEN,
//         {
//           cause: error,
//         },
//       );
//     }
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     try {
//       await this.userAccessService.remove(+id);
//       return { message: 'successfully removed' };
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.NOT_FOUND,
//           error: error.message,
//         },
//         HttpStatus.NOT_FOUND,
//         {
//           cause: error,
//         },
//       );
//     }
//   }
// }
