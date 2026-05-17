import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { gerarSenhaPadrao } from '../src/lib/utils';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

// Enums como strings (compatível com Prisma 7)
const Papel = {
    ADMIN: 'ADMIN',
    COMPRADOR: 'COMPRADOR',
} as const;

const Cartao = {
    NUBANK: 'NUBANK',
    INTER: 'INTER',
    HIPER: 'HIPER',
    ITAU: 'ITAU',
} as const;

// Senha padrão para seed (pode ser sobrescrita via .env)
const SENHA_PADRAO_SEED = process.env.SENHA_PADRAO_SEED ?? '123';

async function main() {
    // ==================== ADMIN ====================
    const adminExiste = await (prisma as any).usuario.findUnique({
        where: { login: 'admin' },
    });

    if (!adminExiste) {
        const senha = await bcrypt.hash(`admin${SENHA_PADRAO_SEED}`, 10);
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
        { nome: 'Pedro', sobrenome: 'Teste', usaUber: false },
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
            const senha = await bcrypt.hash(gerarSenhaPadrao(login), 10);
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
            console.log(
                `✅ Comprador criado: ${login} / senha: ${gerarSenhaPadrao(login)}`
            );

            // Compras padrão para todos exceto Pedro
            if (c.nome !== 'Pedro') {
                const compras = gerarComprasPadrao(usuario.id, mes, ano);
                for (const compra of compras)
                    await (prisma as any).compra.create({ data: compra });
                console.log(`   └─ ${compras.length} compras criadas`);
            }

            // Compras variadas para Pedro
            if (c.nome === 'Pedro') {
                const compras = gerarComprasVariadas(usuario.id, mes, ano);
                for (const compra of compras)
                    await (prisma as any).compra.create({ data: compra });
                console.log(
                    `   └─ ${compras.length} compras criadas (variadas)`
                );
            }

            // Corridas para quem usa Uber
            if (c.usaUber) {
                const corridas = [
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 3),
                        mesReferencia: mes,
                        anoReferencia: ano,
                        valor: 18.5,
                    },
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 7),
                        mesReferencia: mes,
                        anoReferencia: ano,
                        valor: 22.0,
                    },
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 12),
                        mesReferencia: mes,
                        anoReferencia: ano,
                        valor: 15.75,
                    },
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 18),
                        mesReferencia: mes,
                        anoReferencia: ano,
                        valor: 30.0,
                    },
                    {
                        usuarioId: usuario.id,
                        data: new Date(ano, mes - 1, 25),
                        mesReferencia: mes,
                        anoReferencia: ano,
                        valor: 12.9,
                    },
                ];
                for (const corrida of corridas)
                    await (prisma as any).corrida.create({ data: corrida });
                console.log(
                    `   └─ ${corridas.length} corridas de Uber criadas`
                );
            }
        } else {
            console.log(`ℹ️ Comprador já existe: ${login}`);
        }
    }
}

// Compras padrão — 3 compras em cartões diferentes
function gerarComprasPadrao(usuarioId: string, mes: number, ano: number) {
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
            ...calcFim(mes, ano, 10),
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
            ...calcFim(mes, ano, 3),
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
            ...calcFim(mes, ano, 6),
            valorParcela: 99.9,
        },
    ];
}

// Compras variadas para testar ordenação por cartão e por término
function gerarComprasVariadas(usuarioId: string, mes: number, ano: number) {
    return [
        {
            usuarioId,
            cartao: Cartao.NUBANK,
            descricao: 'Notebook Dell',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 12,
            ...calcFim(mes, ano, 12),
            valorParcela: 400.0,
        },
        {
            usuarioId,
            cartao: Cartao.NUBANK,
            descricao: 'TV Samsung',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 8,
            ...calcFim(mes, ano, 8),
            valorParcela: 250.0,
        },
        {
            usuarioId,
            cartao: Cartao.NUBANK,
            descricao: 'Fone Bluetooth',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 3,
            ...calcFim(mes, ano, 3),
            valorParcela: 90.0,
        },
        {
            usuarioId,
            cartao: Cartao.NUBANK,
            descricao: 'Cadeira Gamer',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 6,
            ...calcFim(mes, ano, 6),
            valorParcela: 150.0,
        },
        {
            usuarioId,
            cartao: Cartao.INTER,
            descricao: 'Tênis Nike',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 2,
            ...calcFim(mes, ano, 2),
            valorParcela: 180.0,
        },
        {
            usuarioId,
            cartao: Cartao.INTER,
            descricao: 'Mochila',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 5,
            ...calcFim(mes, ano, 5),
            valorParcela: 75.0,
        },
        {
            usuarioId,
            cartao: Cartao.INTER,
            descricao: 'Relógio',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 9,
            ...calcFim(mes, ano, 9),
            valorParcela: 120.0,
        },
        {
            usuarioId,
            cartao: Cartao.ITAU,
            descricao: 'Curso Online',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 4,
            ...calcFim(mes, ano, 4),
            valorParcela: 99.9,
        },
        {
            usuarioId,
            cartao: Cartao.ITAU,
            descricao: 'Livros',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 7,
            ...calcFim(mes, ano, 7),
            valorParcela: 55.0,
        },
        {
            usuarioId,
            cartao: Cartao.HIPER,
            descricao: 'Supermercado',
            mesCompra: mes,
            anoCompra: ano,
            mesInicio: mes,
            anoInicio: ano,
            qtdParcelas: 3,
            ...calcFim(mes, ano, 3),
            valorParcela: 200.0,
        },
    ];
}

// Calcula mês e ano final de uma compra parcelada
function calcFim(mes: number, ano: number, parcelas: number) {
    const total = mes + parcelas - 1;
    const mesFinal = ((total - 1) % 12) + 1;
    const anoFinal = ano + Math.floor((total - 1) / 12);
    return { mesFinal, anoFinal };
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await (prisma as any).$disconnect();
    });