import {
    calcularDividaAnterior,
    calcularTotalComprasNoMes,
    calcularTotalCorridas,
} from '@/lib/utils';
import * as compraRepo from '@/repositories/compra.repository';
import * as corridaRepo from '@/repositories/corrida.repository';
import * as mesRepo from '@/repositories/mes.repository';

export async function listarMesesFechados(usuarioId: string) {
    return await mesRepo.buscarMesesFechados(usuarioId);
}

export async function fecharMes(
    usuarioId: string,
    mes: number,
    ano: number,
    totalPago: number
) {
    // 1. Total de compras ativas no mês (helper centralizado)
    const compras = await compraRepo.buscarComprasPorUsuario(usuarioId);
    const totalCompras = calcularTotalComprasNoMes(compras, mes, ano);

    // 2. Total de corridas Uber no mês (helper centralizado — antes era reduce inline)
    const corridas = await corridaRepo.buscarCorridasDoMes(usuarioId, mes, ano);
    const totalCorridas = calcularTotalCorridas(corridas);

    // 3. Dívida anterior (helper centralizado)
    const mesesAnteriores = await mesRepo.buscarMesesFechados(usuarioId);
    const dividaAnterior = calcularDividaAnterior(mesesAnteriores, mes, ano);

    // 4. Total consolidado do mês
    const totalDoMes = totalCompras + totalCorridas + dividaAnterior;

    return await mesRepo.fecharMes({
        usuarioId,
        mes,
        ano,
        totalDoMes,
        totalPago,
        dividaAnterior,
    });
}