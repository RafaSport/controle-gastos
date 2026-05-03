import { PrismaPg } from '@prisma/adapter-pg';
import { Papel, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Adapter de conexão com PostgreSQL — obrigatório no Prisma 7
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

// PrismaClient recebe o adapter como configuração
const prisma = new PrismaClient({ adapter } as any);

async function main() {
    // Verifica se admin já existe para não duplicar
    const adminExistente = await (prisma as any).usuario.findUnique({
        where: { login: 'admin' },
    });

    if (!adminExistente) {
        // Criptografa a senha antes de salvar
        const senhaCriptografada = await bcrypt.hash('admin123', 10);

        await (prisma as any).usuario.create({
            data: {
                nome: 'Admin',
                sobrenome: 'Sistema',
                login: 'admin',
                senha: senhaCriptografada,
                papel: Papel.ADMIN,
                primeiroLogin: false,
            },
        });

        console.log('✅ Admin criado com sucesso!');
    } else {
        console.log('ℹ️ Admin já existe, seed ignorado.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await (prisma as any).$disconnect();
    });
