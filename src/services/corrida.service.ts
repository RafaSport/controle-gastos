import * as corridaRepo from '@/repositories/corrida.repository';

// Lista corridas de um mês para exibição
export async function listarCorridas(
    usuarioId: string,
    mes: number,
    ano: number
) {
    return await corridaRepo.buscarCorridasDoMes(usuarioId, mes, ano);
}

// Cadastra uma nova corrida
export async function cadastrarCorrida(dados: {
    usuarioId: string;
    data: string; // vem como string do front (ex: "2025-05-10")
    valor: number;
}) {
    return await corridaRepo.criarCorrida({
        usuarioId: dados.usuarioId,
        data: new Date(dados.data),
        valor: dados.valor,
    });
}

// Remove uma corrida
export async function removerCorrida(id: string) {
    return await corridaRepo.deletarCorrida(id);
}
