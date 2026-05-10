import { prisma } from '@/lib/prisma';

// Busca todos os usuários compradores ordenados por nome
export async function buscarTodosCompradores() {
    return await (prisma as any).usuario.findMany({
        where: { papel: 'COMPRADOR' },
        orderBy: { nome: 'asc' },
        include: { compras: true },
    });
}

// Busca um único usuário pelo ID
export async function buscarUsuarioPorId(id: string) {
    return await (prisma as any).usuario.findUnique({
        where: { id },
        include: { compras: true, mesesFechados: true },
    });
}

// Busca um usuário pelo login (usado na autenticação)
export async function buscarUsuarioPorLogin(login: string) {
    return await (prisma as any).usuario.findUnique({
        where: { login },
    });
}

// Cria um novo usuário comprador no banco
export async function criarUsuario(dados: {
    nome: string;
    sobrenome: string;
    login: string;
    senha: string;
    usaUber: boolean;
}) {
    return await (prisma as any).usuario.create({
        data: { ...dados, papel: 'COMPRADOR' },
    });
}

// Atualiza a senha e marca que o primeiro login já foi feito
export async function atualizarSenha(id: string, novaSenha: string) {
    return await (prisma as any).usuario.update({
        where: { id },
        data: { senha: novaSenha, primeiroLogin: false },
    });
}

// Remove um usuário e suas compras (cascade no banco)
export async function deletarUsuario(id: string) {
    return await (prisma as any).usuario.delete({
        where: { id },
    });
}

export async function atualizarComprador(
    id: string,
    dados: {
        nome?: string;
        sobrenome?: string;
        usaUber?: boolean;
    }
) {
    return await (prisma as any).usuario.update({
        where: { id },
        data: dados,
    });
}

// Reseta a senha e marca primeiroLogin para forçar troca no próximo acesso
export async function resetarSenhaUsuario(
    id: string,
    senhaCriptografada: string
) {
    return await (prisma as any).usuario.update({
        where: { id },
        data: { senha: senhaCriptografada, primeiroLogin: true },
    });
}
