import * as corridaRepo from '@/repositories/corrida.repository';

function criarDataLocalDaCorrida(data: string) {
    const [ano, mes, dia] = data.split('-').map(Number);

    // Usa meio-dia local para evitar que conversoes UTC/local exibam o dia anterior.
    return new Date(ano, mes - 1, dia, 12, 0, 0);
}

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
        data: criarDataLocalDaCorrida(dados.data),
        mesReferencia: dados.mesReferencia,
        anoReferencia: dados.anoReferencia,
        valor: dados.valor,
    });
}

// Remove uma corrida pelo ID.
export async function removerCorrida(id: string) {
    return await corridaRepo.deletarCorrida(id);
}
