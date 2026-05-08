import { calcularMesFinal } from '@/lib/utils';
import * as compraRepo from '@/repositories/compra.repository';

// Retorna as compras de um usuário
export async function listarCompras(usuarioId: string) {
    return await compraRepo.buscarComprasPorUsuario(usuarioId);
}

// Cadastra uma compra calculando automaticamente o mês final
export async function cadastrarCompra(dados: {
    usuarioId: string;
    cartao: string;
    descricao: string;
    mesCompra: number;
    anoCompra: number;
    mesInicio: number;
    anoInicio: number;
    qtdParcelas: number;
    valorParcela: number;
}) {
    // Calcula o mês e ano em que a última parcela será paga
    const { mesFinal, anoFinal } = calcularMesFinal(
        dados.mesInicio,
        dados.anoInicio,
        dados.qtdParcelas
    );

    return await compraRepo.criarCompra({ ...dados, mesFinal, anoFinal });
}

// Edita uma compra e recalcula o mês final se necessário
export async function editarCompra(id: string, dados: any) {
    if (dados.mesInicio && dados.anoInicio && dados.qtdParcelas) {
        const { mesFinal, anoFinal } = calcularMesFinal(
            dados.mesInicio,
            dados.anoInicio,
            dados.qtdParcelas
        );
        dados = { ...dados, mesFinal, anoFinal };
    }
    return await compraRepo.atualizarCompra(id, dados);
}

// Remove uma compra
export async function removerCompra(id: string) {
    return await compraRepo.deletarCompra(id);
}
