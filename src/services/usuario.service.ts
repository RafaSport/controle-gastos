import { gerarLogin, gerarSenhaPadrao } from '@/lib/utils';
import * as usuarioRepo from '@/repositories/usuario.repository';
import bcrypt from 'bcryptjs';

// Retorna todos os compradores com dados resumidos para a tela do admin
export async function listarCompradores() {
    const usuarios = await usuarioRepo.buscarTodosCompradores();
    return usuarios.map((u: any) => ({
        id: u.id,
        nome: u.nome,
        sobrenome: u.sobrenome,
        login: u.login,
        qtdCompras: u.compras.length,
        // total de parcelas ainda a pagar (mês atual em diante)
        totalAPagar: u.compras.reduce(
            (acc: number, c: any) => acc + c.valorParcela,
            0
        ),
    }));
}

// Busca um comprador com todas as suas compras e meses
export async function buscarComprador(id: string) {
    return await usuarioRepo.buscarUsuarioPorId(id);
}

// Cadastra um novo comprador gerando login e senha automaticamente
export async function cadastrarComprador(nome: string, sobrenome: string) {
    const login = gerarLogin(nome, sobrenome);
    const senhaPadrao = gerarSenhaPadrao(login);

    // Criptografa a senha padrão antes de salvar
    const senhaCriptografada = await bcrypt.hash(senhaPadrao, 10);

    return await usuarioRepo.criarUsuario({
        nome,
        sobrenome,
        login,
        senha: senhaCriptografada,
    });
}

// Altera a senha do usuário após o primeiro login
export async function alterarSenha(id: string, novaSenha: string) {
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
    return await usuarioRepo.atualizarSenha(id, senhaCriptografada);
}

// Remove um comprador do sistema
export async function removerComprador(id: string) {
    return await usuarioRepo.deletarUsuario(id);
}
