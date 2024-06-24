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

export async function getUserByToken(usuarioID: number): Promise<any> {
  try {
    const user = await prisma.$queryRaw(
      Prisma.sql`SELECT * FROM usuario WHERE id = ${usuarioID}`,
    );
    return Array.isArray(user) && user.length > 0 ? user[0] : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
