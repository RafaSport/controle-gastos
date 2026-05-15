import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Evita múltiplas instâncias do Prisma durante hot reload
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function criarPrismaClient() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    return new PrismaClient({
        adapter,
    });
}

export const prisma = globalForPrisma.prisma ?? criarPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
