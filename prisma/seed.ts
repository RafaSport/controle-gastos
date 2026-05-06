import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { Cartao, Papel } from '../src/generated/prisma/enums';

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
        { nome: 'Ana', sobrenome: 'Bia', usaUber: false },
        { nome: 'Carlos', sobrenome: 'Silva', usaUber: false },
        { nome: 'Marta', sobrenome: 'Lima', usaUber: false },
        { nome: 'João', sobrenome: 'Uber', usaUber: true },
    ];

    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const ano = hoje.getFullYear();

    for (const c of compradores) {
        const login = `${c.nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')}.${c.sobrenome.toLowerCase()}`;
        const existe = await (prisma as any).usuario.findUnique({
            where: { login },
        });

        if (!existe) {
            const senha = await bcrypt.hash(`${login}123`, 10);

            // Cria o comprador com o campo usaUber
            const usuario = await (prisma as any).usuario.create({
                data: {
                    nome: c.nome,
                    sobrenome: c.sobrenome,
                    login,
                    senha,
                    papel: Papel.COMPRADOR,
                    primeiroLogin: true,
                    usaUber: c.usaUber,
                },
            });

            console.log(`✅ Comprador criado: ${login} / senha: ${login}123`);

            // ==================== COMPRAS ====================
            const comprasDoUsuario = gerarCompras(usuario.id, mes, ano);
            for (const compra of comprasDoUsuario) {
                await (prisma as any).compra.create({ data: compra });
            }
            console.log(`   └─ ${comprasDoUsuario.length} compras criadas`);

            // ==================== CORRIDAS (só quem usa Uber) ====================
            if (c.usaUber) {
                const corridas = [
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 3),
                        valor: 18.5,
                    },
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 7),
                        valor: 22.0,
                    },
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 12),
                        valor: 15.75,
                    },
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 18),
                        valor: 30.0,
                    },
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 25),
                        valor: 12.9,
                    },
                ];
                for (const corrida of corridas) {
                    await (prisma as any).corrida.create({ data: corrida });
                }
                console.log(
                    `   └─ ${corridas.length} corridas de Uber criadas`
                );
            }
        } else {
            console.log(`ℹ️ Comprador já existe: ${login}`);
        }
    }
}

// Gera compras de exemplo para um usuário
function gerarCompras(usuarioId: string, mes: number, ano: number) {
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
