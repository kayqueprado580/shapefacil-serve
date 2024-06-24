import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/lib/prisma.service';
import { UserDTO } from './dto/userEdit.dto';
import { UserCreateDTO } from './dto/userCreate.dto';
import { Usuario } from './entities/user.entity';
import { checkIfExists } from '@/util/database.utils';
// import { hasChanged } from '@/util/change-detector.utils';
// import { UserAccessService } from '@/userAccess/userAccess.service';
// import { UserAccessDTO } from '@/userAccess/dto/userAccess.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    // private userAccess: UserAccessService,
  ) {}

  async findAll(skip: number, take: number, orderBy: boolean, userId: number) {
    // let where: any = {};
    // const access: UserAccessDTO = await this.userAccess.findByUserId(userId);
    // const userCurrent: UserDTO = await this.findOne(userId);

    // if (access) {
    //   if (access.name == 'administrator') {
    //     where = {
    //       NOT: [{ typeUser: 'supreme' }, { typeUser: 'administrator' }],
    //     };
    //     if (userCurrent.clientId) {
    //       where.clientId = userCurrent.clientId;
    //     }
    //   } else {
    //     where = {};
    //   }
    // } else {
    //   where = {};
    // }

    const users: UserDTO[] = await this.prisma.usuario.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 20,
      orderBy: {
        createdAt: orderBy ? 'asc' : 'desc',
      },
      where: {},
    });

    return users;
  }

  async findOne(id: number) {
    return await this.prisma.usuario.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findOneByToken(usuario: string) {
    return await this.prisma.usuario.findUniqueOrThrow({
      where: {
        usuario,
      },
    });
  }

  // async create(userDTO: UserCreateDTO): Promise<Usuario> {
  //   // const access: UserAccessDTO = await this.userAccess.findByAccessName(
  //   //   userDTO.typeUser,
  //   // );

  //   const emailExists = await checkIfExists('users', 'email', userDTO.email);
  //   if (emailExists)
  //     throw new NotFoundException('Já existe um usuário com este email.');

  //   const usernameExists = await checkIfExists(
  //     'usuario',
  //     'usuario',
  //     userDTO.usuario,
  //   );
  //   if (usernameExists) throw new NotFoundException('Usuário já existe!');

  //   const hash = await bcrypt.hash(userDTO.senha, 10);
  //   const data: Prisma.UsuarioCreateInput = {
  //     ...userDTO,
  //     senha: hash,
  //   };

  //   const createdUser = await this.prisma.usuario.create({ data });

  //   // await this.userAccess.create({
  //   //   ...access,
  //   //   userId: createdUser.id,
  //   // });

  //   return {
  //     ...createdUser,
  //     senha: undefined,
  //   };
  // }

  // async update(id: number, userDTO: UserDTO): Promise<Usuario> {
  //   const userBase = await this.prisma.usuario.findUniqueOrThrow({
  //     where: {
  //       id,
  //     },
  //   });

  //   const usernameHasChanged = hasChanged(userBase.username, userDTO.username);
  //   if (usernameHasChanged) {
  //     const usernameExists = await checkIfExists(
  //       'users',
  //       'username',
  //       userDTO.username,
  //     );
  //     if (usernameExists) {
  //       throw new NotFoundException('Já existe um usuário com este username.');
  //     }
  //   }

  //   const emailHasChanged = hasChanged(userBase.email, userDTO.email);
  //   if (emailHasChanged) {
  //     const emailExists = await checkIfExists('users', 'email', userDTO.email);
  //     if (emailExists) {
  //       throw new NotFoundException('Já existe um usuário com este email.');
  //     }
  //   }

  //   const data: Prisma.UserUpdateInput = {
  //     ...userDTO,
  //   };

  //   const updatedUser = await this.prisma.usuario.update({
  //     data,
  //     where: {
  //       id,
  //     },
  //   });

  //   return {
  //     ...updatedUser,
  //     password: undefined,
  //   };
  // }

  // async updatePassword(id: number, userDTO: UserDTO): Promise<Usuario> {
  //   const userBase = await this.prisma.usuario.findUniqueOrThrow({
  //     where: {
  //       id,
  //     },
  //   });

  //   const isPasswordValid = await this.comparePwd(
  //     userDTO.password,
  //     userBase.password,
  //   );

  //   if (isPasswordValid)
  //     throw new BadRequestException(
  //       'Nova senha, igual a antiga. Por favor, troque de senha!',
  //     );

  //   const newPasswordHash = await bcrypt.hash(userDTO.password, 10);
  //   const updatedUser = await this.prisma.usuario.update({
  //     where: { id },
  //     data: {
  //       password: newPasswordHash,
  //     },
  //   });

  //   return {
  //     ...updatedUser,
  //     password: undefined,
  //   };
  // }

  // async remove(id: number) {
  //   const userExists = await checkIfExists('users', 'id', id);
  //   if (!userExists) {
  //     throw new NotFoundException('usuário não existe');
  //   }

  //   return await this.prisma.usuario.delete({
  //     where: {
  //       id,
  //     },
  //   });
  // }

  // async comparePwd(password: string, hash: string) {
  //   return await bcrypt.compare(password, hash);
  // }
}
