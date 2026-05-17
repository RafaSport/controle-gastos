import { criarDataLocalMeioDia } from '@/lib/utils';
import * as corridaRepo from '@/repositories/corrida.repository';

// Lista corridas de um mes para exibicao.
export async function listarCorridas(
    usuarioId: string,
    mes: number,
    ano: number
) {
    return await corridaRepo.buscarCorridasDoMes(usuarioId, mes, ano);
}

// Cadastra uma nova corrida preservando o dia escolhido no formulario.
export async function cadastrarCorrida(dados: {
    usuarioId: string;
    data: string;
    mesReferencia: number;
    anoReferencia: number;
    valor: number;
}) {
    return await corridaRepo.criarCorrida({
        usuarioId: dados.usuarioId,
        data: criarDataLocalMeioDia(dados.data),
        mesReferencia: dados.mesReferencia,
        anoReferencia: dados.anoReferencia,
        valor: dados.valor,
    });
}

// Remove uma corrida pelo ID.
export async function removerCorrida(id: string) {
    return await corridaRepo.deletarCorrida(id);
}