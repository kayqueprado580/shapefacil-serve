import { Injectable } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
// import { PrismaService } from '@/lib/prisma.service';
// import { UserAccessDTO } from './dto/userAccess.dto';
// import { UserAccess } from './entities/userAccess.entity';

@Injectable()
export class UserAccessService {
  // constructor(private prisma: PrismaService) {}
  // async findAll() {
  //   return await this.prisma.userAccess.findMany({});
  // }
  // async findByUserId(userId: number) {
  //   return await this.prisma.userAccess.findUnique({
  //     where: {
  //       userId,
  //     },
  //   });
  // }
  // async findByAccessName(name: string) {
  //   return await this.prisma.userAccess.findUnique({
  //     where: {
  //       name,
  //     },
  //   });
  // }
  // async findOne(id: number) {
  //   return await this.prisma.userAccess.findUniqueOrThrow({
  //     where: {
  //       id,
  //     },
  //   });
  // }
  // async create(userDTO: UserAccessDTO): Promise<UserAccess> {
  //   const data: Prisma.UserAccessCreateInput = {
  //     ...userDTO,
  //   };
  //   const createdUser = await this.prisma.userAccess.create({ data });
  //   return createdUser;
  // }
  // async update(id: number, userDTO: UserAccessDTO): Promise<UserAccess> {
  //   const data: Prisma.UserAccessUpdateInput = {
  //     ...userDTO,
  //   };
  //   const updatedUser = await this.prisma.user.update({
  //     data,
  //     where: {
  //       id,
  //     },
  //   });
  //   return updatedUser;
  // }
  // async remove(id: number) {
  //   return await this.prisma.user.delete({
  //     where: {
  //       id,
  //     },
  //   });
  // }
}
