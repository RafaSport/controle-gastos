import { calcularDividaAnterior, calcularTotalComprasNoMes } from '@/lib/utils';
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
    // --------------------------------------------------------
    // 1. Total de compras ativas no mês (usa helper centralizado)
    // --------------------------------------------------------
    const compras = await compraRepo.buscarComprasPorUsuario(usuarioId);
    const totalCompras = calcularTotalComprasNoMes(compras, mes, ano);

    // --------------------------------------------------------
    // 2. Total de corridas Uber no mês
    // --------------------------------------------------------
    const corridas = await corridaRepo.buscarCorridasDoMes(usuarioId, mes, ano);
    const totalCorridas = corridas.reduce(
        (acc: number, c: any) => acc + c.valor,
        0
    );

    // --------------------------------------------------------
    // 3. Dívida anterior (usa helpers centralizados)
    // Antes: lógica inline duplicada de filtro + sort + cálculo
    // Agora: reutiliza buscarUltimoMesFechado + calcularDividaAnterior
    // --------------------------------------------------------
    const mesesAnteriores = await mesRepo.buscarMesesFechados(usuarioId);
    const dividaAnterior = calcularDividaAnterior(mesesAnteriores, mes, ano);

    // --------------------------------------------------------
    // 4. Total consolidado do mês
    // --------------------------------------------------------
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