import { prisma } from '@/lib/prisma';

// Busca todos os meses fechados de um usuário
export async function buscarMesesFechados(usuarioId: string) {
    return await (prisma as any).mesFechado.findMany({
        where: { usuarioId },
        orderBy: [{ ano: 'asc' }, { mes: 'asc' }],
    });
}

// Cria ou atualiza o registro de um mês fechado
export async function fecharMes(dados: {
    usuarioId: string;
    mes: number;
    ano: number;
    totalPago: number;
    dividaAnterior: number;
}) {
    return await (prisma as any).mesFechado.upsert({
        where: {
            usuarioId_mes_ano: {
                usuarioId: dados.usuarioId,
                mes: dados.mes,
                ano: dados.ano,
            },
        },
        update: {
            totalPago: dados.totalPago,
            dividaAnterior: dados.dividaAnterior,
        },
        create: dados,
    });
}
