import { Cartao } from '@/generated/prisma/client';
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

    // Monta o objeto no formato que o Prisma espera (CompraCreateInput)
    return await compraRepo.criarCompra({
        cartao: dados.cartao as Cartao, // ← Cast para o enum do Prisma
        descricao: dados.descricao,
        mesCompra: dados.mesCompra,
        anoCompra: dados.anoCompra,
        mesInicio: dados.mesInicio,
        anoInicio: dados.anoInicio,
        mesFinal,
        anoFinal,
        qtdParcelas: dados.qtdParcelas,
        valorParcela: dados.valorParcela,
        usuario: {
            connect: { id: dados.usuarioId },
        },
    });
}

// Edita uma compra e recalcula o mês final se necessário
export async function editarCompra(
    id: string,
    dados: {
        usuarioId?: string;
        cartao?: string;
        descricao?: string;
        mesCompra?: number;
        anoCompra?: number;
        mesInicio?: number;
        anoInicio?: number;
        qtdParcelas?: number;
        valorParcela?: number;
    }
) {
    let dadosAtualizados: any = { ...dados };

    if (dados.mesInicio && dados.anoInicio && dados.qtdParcelas) {
        const { mesFinal, anoFinal } = calcularMesFinal(
            dados.mesInicio,
            dados.anoInicio,
            dados.qtdParcelas
        );
        dadosAtualizados = { ...dadosAtualizados, mesFinal, anoFinal };
    }

    // Remove usuarioId se existir (não pode atualizar relação diretamente)
    delete dadosAtualizados.usuarioId;

    return await compraRepo.atualizarCompra(id, dadosAtualizados);
}

// Remove uma compra
export async function removerCompra(id: string) {
    return await compraRepo.deletarCompra(id);
}
