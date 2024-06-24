import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkIfExists(
  tableName: string,
  columnName: string,
  value: string | number,
): Promise<boolean> {
  const query = Prisma.sql`
    SELECT EXISTS (
        SELECT 1 FROM ${Prisma.raw(`"${tableName}"`)}
        WHERE ${Prisma.raw(`"${columnName}"`)} = ${value}
    ) as "exists"
  `;

  const result = await prisma.$queryRaw(query);
  return result[0].exists;
}
