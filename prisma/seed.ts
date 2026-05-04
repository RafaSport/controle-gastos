import { PrismaPg } from '@prisma/adapter-pg';
import { Cartao, Papel, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
    // ==================== ADMIN ====================
    const adminExiste = await (prisma as any).usuario.findUnique({
        where: { login: 'admin' },
    });

    if (!adminExiste) {
        const senha = await bcrypt.hash('admin123', 10);
        await (prisma as any).usuario.create({
            data: {
                nome: 'Admin',
                sobrenome: 'Sistema',
                login: 'admin',
                senha,
                papel: Papel.ADMIN,
                primeiroLogin: false,
            },
        });
        console.log('✅ Admin criado');
    } else {
        console.log('ℹ️ Admin já existe');
    }

    // ==================== COMPRADORES ====================
    const compradores = [
        { nome: 'Ana', sobrenome: 'Bia' },
        { nome: 'Carlos', sobrenome: 'Silva' },
        { nome: 'Marta', sobrenome: 'Lima' },
    ];

    for (const c of compradores) {
        const login = `${c.nome.toLowerCase()}.${c.sobrenome.toLowerCase()}`;
        const existe = await (prisma as any).usuario.findUnique({
            where: { login },
        });

        if (!existe) {
            const senha = await bcrypt.hash(`${login}123`, 10);
            const usuario = await (prisma as any).usuario.create({
                data: {
                    nome: c.nome,
                    sobrenome: c.sobrenome,
                    login,
                    senha,
                    papel: Papel.COMPRADOR,
                    primeiroLogin: true,
                },
            });

            console.log(`✅ Comprador criado: ${login} / senha: ${login}123`);

            // ==================== COMPRAS ====================
            // Cada comprador recebe compras em cartões diferentes
            const comprasDoUsuario = comprasExemplo(usuario.id);
            for (const compra of comprasDoUsuario) {
                await (prisma as any).compra.create({ data: compra });
            }
            console.log(`   └─ ${comprasDoUsuario.length} compras criadas`);
        } else {
            console.log(`ℹ️ Comprador já existe: ${login}`);
        }
    }
}

// Gera compras de exemplo para um usuário
function comprasExemplo(usuarioId: string) {
    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const ano = hoje.getFullYear();

    return [
        {
            usuarioId,
            cartao: Cartao.NUBANK,
            descricao: 'Notebook Dell',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 10,
            mesFinal: ((mes + 9 - 1) % 12) + 1,
            anoFinal: ano + Math.floor((mes + 9 - 1) / 12),
            valorParcela: 350.0,
        },
        {
            usuarioId,
            cartao: Cartao.INTER,
            descricao: 'Tênis Nike',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 3,
            mesFinal: ((mes + 2 - 1) % 12) + 1,
            anoFinal: ano + Math.floor((mes + 2 - 1) / 12),
            valorParcela: 180.0,
        },
        {
            usuarioId,
            cartao: Cartao.ITAU,
            descricao: 'Curso Online',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 6,
            mesFinal: ((mes + 5 - 1) % 12) + 1,
            anoFinal: ano + Math.floor((mes + 5 - 1) / 12),
            valorParcela: 99.9,
        },
    ];
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await (prisma as any).$disconnect();
    });
