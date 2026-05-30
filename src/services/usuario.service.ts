import {
    calcularDividaAnterior,
    calcularTotalComprasNoMes,
    calcularTotalCorridas,
    encontrarPrimeiroMesEmAberto,
    gerarLogin,
    gerarSenhaPadrao,
} from '@/lib/utils';
import * as usuarioRepo from '@/repositories/usuario.repository';
import bcrypt from 'bcryptjs';

export async function listarCompradores() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const usuarios = await usuarioRepo.buscarTodosCompradores();

    return usuarios.map((u: any) => {
        const compras = u.compras || [];
        const mesesFechados = u.mesesFechados || [];
        const corridas = u.corridas || [];

        // Encontra o primeiro mês em aberto para este usuário
        const { mes: mesEmAberto, ano: anoEmAberto } =
            encontrarPrimeiroMesEmAberto(mesesFechados, mesAtual, anoAtual);

        // Calcula total de compras ativas no mês em aberto
        const totalCompras = calcularTotalComprasNoMes(
            compras,
            mesEmAberto,
            anoEmAberto
        );

        // Filtra corridas Uber do mês em aberto
        const corridasDoMes = corridas.filter(
            (c: any) =>
                c.mesReferencia === mesEmAberto &&
                c.anoReferencia === anoEmAberto
        );
        const totalUber = calcularTotalCorridas(corridasDoMes);

        // Calcula dívida anterior (rolante)
        const dividaAnterior = calcularDividaAnterior(
            mesesFechados,
            mesEmAberto,
            anoEmAberto
        );

        // Total consolidado do mês em aberto = compras + uber + dívida anterior
        const totalAPagar = totalCompras + totalUber + dividaAnterior;

        // Conta apenas compras ativas no mês em aberto
        const qtdCompras = compras.filter((c: any) => {
            const inicio = c.anoInicio * 12 + c.mesInicio;
            const fim = c.anoFinal * 12 + c.mesFinal;
            const selecionado = anoEmAberto * 12 + mesEmAberto;
            return inicio <= selecionado && fim >= selecionado;
        }).length;

        return {
            id: u.id,
            nome: u.nome,
            sobrenome: u.sobrenome,
            login: u.login,
            usaUber: u.usaUber,
            qtdCompras,
            mesEmAberto,
            anoEmAberto,
            totalAPagar,
        };
    });
}

export async function buscarComprador(id: string) {
    return await usuarioRepo.buscarUsuarioPorId(id);
}

export async function cadastrarComprador(
    nome: string,
    sobrenome: string,
    usaUber: boolean = false
) {
    const login = gerarLogin(nome, sobrenome);
    const senhaPadrao = gerarSenhaPadrao(login);
    const senhaCriptografada = await bcrypt.hash(senhaPadrao, 10);
    return await usuarioRepo.criarUsuario({
        nome,
        sobrenome,
        login,
        senha: senhaCriptografada,
        usaUber,
    });
}

export async function alterarSenha(id: string, novaSenha: string) {
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
    return await usuarioRepo.atualizarSenha(id, senhaCriptografada);
}

export async function removerComprador(id: string) {
    return await usuarioRepo.deletarUsuario(id);
}

export async function alterarComprador(
    id: string,
    dados: {
        nome?: string;
        sobrenome?: string;
        usaUber?: boolean;
    }
) {
    return await usuarioRepo.atualizarComprador(id, dados);
}

export async function resetarSenha(id: string) {
    // Busca o login do usuário para gerar a senha padrão
    const usuario = await usuarioRepo.buscarUsuarioPorId(id);
    if (!usuario) throw new Error('Usuário não encontrado');

    const senhaPadrao = gerarSenhaPadrao(usuario.login);
    const senhaCriptografada = await bcrypt.hash(senhaPadrao, 10);

    return await usuarioRepo.resetarSenhaUsuario(id, senhaCriptografada);
}
