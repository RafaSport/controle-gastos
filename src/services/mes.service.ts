import * as compraRepo from '@/repositories/compra.repository';
import * as mesRepo from '@/repositories/mes.repository';

// Retorna os meses fechados de um usuário
export async function listarMesesFechados(usuarioId: string) {
    return await mesRepo.buscarMesesFechados(usuarioId);
}

// Fecha o mês atual calculando o total a pagar e acumulando dívida anterior
export async function fecharMes(
    usuarioId: string,
    mes: number,
    ano: number,
    totalPago: number
) {
    const compras = await compraRepo.buscarComprasPorUsuario(usuarioId);

    // Soma o valor de todas as parcelas que vencem neste mês
    const totalDoMes = compras
        .filter((c: any) => c.mesInicio <= mes && c.mesFinal >= mes)
        .reduce((acc: number, c: any) => acc + c.valorParcela, 0);

    // O que não foi pago vira dívida acumulada
    const dividaAnterior = Math.max(0, totalDoMes - totalPago);

    return await mesRepo.fecharMes({
        usuarioId,
        mes,
        ano,
        totalPago,
        dividaAnterior,
    });
}
