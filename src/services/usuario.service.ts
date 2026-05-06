import { gerarLogin, gerarSenhaPadrao } from '@/lib/utils';
import * as usuarioRepo from '@/repositories/usuario.repository';
import bcrypt from 'bcryptjs';

export async function listarCompradores() {
    const usuarios = await usuarioRepo.buscarTodosCompradores();
    return usuarios.map((u: any) => ({
        id: u.id,
        nome: u.nome,
        sobrenome: u.sobrenome,
        login: u.login,
        usaUber: u.usaUber,
        qtdCompras: u.compras.length,
        totalAPagar: u.compras.reduce(
            (acc: number, c: any) => acc + c.valorParcela,
            0
        ),
    }));
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
