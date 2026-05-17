import * as usuarioRepo from '@/repositories/usuario.repository';
import * as usuarioService from '@/services/usuario.service';
import bcrypt from 'bcryptjs';
import { describe, expect, it, vi } from 'vitest';

// ============================================
// MOCKS
// ============================================

vi.mock('@/repositories/usuario.repository', () => ({
    buscarTodosCompradores: vi.fn(),
    buscarUsuarioPorId: vi.fn(),
    criarUsuario: vi.fn(),
    atualizarSenha: vi.fn(),
    deletarUsuario: vi.fn(),
    atualizarComprador: vi.fn(),
    resetarSenhaUsuario: vi.fn(),
}));

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn(),
    },
}));

vi.mock('@/lib/utils', () => ({
    gerarLogin: vi.fn(),
    gerarSenhaPadrao: vi.fn(),
}));

// ============================================
// SUITE: listarCompradores
// ============================================
describe('listarCompradores', () => {
    it('deve retornar lista mapeada com qtdCompras e totalAPagar', async () => {
        const mockUsuarios = [
            {
                id: 'u1',
                nome: 'Ana',
                sobrenome: 'Bia',
                login: 'ana.bia',
                usaUber: true,
                compras: [{ valorParcela: 100 }, { valorParcela: 200 }],
            },
            {
                id: 'u2',
                nome: 'João',
                sobrenome: 'Silva',
                login: 'joao.silva',
                usaUber: false,
                compras: [],
            },
        ];
        vi.mocked(usuarioRepo.buscarTodosCompradores).mockResolvedValue(
            mockUsuarios as any
        );

        const resultado = await usuarioService.listarCompradores();

        expect(resultado).toHaveLength(2);
        expect(resultado[0]).toEqual({
            id: 'u1',
            nome: 'Ana',
            sobrenome: 'Bia',
            login: 'ana.bia',
            usaUber: true,
            qtdCompras: 2,
            totalAPagar: 300,
        });
        expect(resultado[1]).toEqual({
            id: 'u2',
            nome: 'João',
            sobrenome: 'Silva',
            login: 'joao.silva',
            usaUber: false,
            qtdCompras: 0,
            totalAPagar: 0,
        });
    });
});

// ============================================
// SUITE: buscarComprador
// ============================================
describe('buscarComprador', () => {
    it('deve retornar usuário pelo ID', async () => {
        const mockUsuario = { id: 'u1', nome: 'Ana' };
        vi.mocked(usuarioRepo.buscarUsuarioPorId).mockResolvedValue(
            mockUsuario as any
        );

        const resultado = await usuarioService.buscarComprador('u1');

        expect(usuarioRepo.buscarUsuarioPorId).toHaveBeenCalledWith('u1');
        expect(resultado).toEqual(mockUsuario);
    });
});

// ============================================
// SUITE: cadastrarComprador
// ============================================
describe('cadastrarComprador', () => {
    it('deve gerar login, senha padrão e criar usuário com hash', async () => {
        const { gerarLogin, gerarSenhaPadrao } = await import('@/lib/utils');
        vi.mocked(gerarLogin).mockReturnValue('maria.souza');
        vi.mocked(gerarSenhaPadrao).mockReturnValue('maria.souza123');
        vi.mocked(bcrypt.hash).mockResolvedValue('hash-123' as never);

        const mockRetorno = {
            id: 'u-new',
            nome: 'Maria',
            login: 'maria.souza',
        };
        vi.mocked(usuarioRepo.criarUsuario).mockResolvedValue(
            mockRetorno as any
        );

        const resultado = await usuarioService.cadastrarComprador(
            'Maria',
            'Souza',
            true
        );

        expect(gerarLogin).toHaveBeenCalledWith('Maria', 'Souza');
        expect(gerarSenhaPadrao).toHaveBeenCalledWith('maria.souza');
        expect(bcrypt.hash).toHaveBeenCalledWith('maria.souza123', 10);
        expect(usuarioRepo.criarUsuario).toHaveBeenCalledWith({
            nome: 'Maria',
            sobrenome: 'Souza',
            login: 'maria.souza',
            senha: 'hash-123',
            usaUber: true,
        });
        expect(resultado).toEqual(mockRetorno);
    });

    it('deve usar usaUber=false como padrão', async () => {
        const { gerarLogin, gerarSenhaPadrao } = await import('@/lib/utils');
        vi.mocked(gerarLogin).mockReturnValue('pedro.alves');
        vi.mocked(gerarSenhaPadrao).mockReturnValue('pedro.alves123');
        vi.mocked(bcrypt.hash).mockResolvedValue('hash-456' as never);
        vi.mocked(usuarioRepo.criarUsuario).mockResolvedValue({} as any);

        await usuarioService.cadastrarComprador('Pedro', 'Alves');

        expect(usuarioRepo.criarUsuario).toHaveBeenCalledWith(
            expect.objectContaining({ usaUber: false })
        );
    });
});

// ============================================
// SUITE: alterarSenha
// ============================================
describe('alterarSenha', () => {
    it('deve criptografar nova senha e atualizar no repository', async () => {
        vi.mocked(bcrypt.hash).mockResolvedValue('hash-nova' as never);
        vi.mocked(usuarioRepo.atualizarSenha).mockResolvedValue({
            id: 'u1',
            senha: 'hash-nova',
        } as any);

        const resultado = await usuarioService.alterarSenha(
            'u1',
            'novaSenha123'
        );

        expect(bcrypt.hash).toHaveBeenCalledWith('novaSenha123', 10);
        expect(usuarioRepo.atualizarSenha).toHaveBeenCalledWith(
            'u1',
            'hash-nova'
        );
        expect(resultado).toEqual({ id: 'u1', senha: 'hash-nova' });
    });
});

// ============================================
// SUITE: removerComprador
// ============================================
describe('removerComprador', () => {
    it('deve chamar repository para deletar', async () => {
        vi.mocked(usuarioRepo.deletarUsuario).mockResolvedValue({} as any);

        await usuarioService.removerComprador('u-99');

        expect(usuarioRepo.deletarUsuario).toHaveBeenCalledWith('u-99');
    });
});

// ============================================
// SUITE: alterarComprador
// ============================================
describe('alterarComprador', () => {
    it('deve repassar dados ao repository', async () => {
        const dados = { nome: 'Novo Nome', usaUber: true };
        vi.mocked(usuarioRepo.atualizarComprador).mockResolvedValue({
            id: 'u1',
            ...dados,
        } as any);

        const resultado = await usuarioService.alterarComprador('u1', dados);

        expect(usuarioRepo.atualizarComprador).toHaveBeenCalledWith(
            'u1',
            dados
        );
        expect(resultado).toEqual({ id: 'u1', ...dados });
    });
});

// ============================================
// SUITE: resetarSenha
// ============================================
describe('resetarSenha', () => {
    it('deve buscar usuário, gerar senha padrão e resetar', async () => {
        const { gerarSenhaPadrao } = await import('@/lib/utils');
        vi.mocked(usuarioRepo.buscarUsuarioPorId).mockResolvedValue({
            id: 'u1',
            login: 'ana.bia',
        } as any);
        vi.mocked(gerarSenhaPadrao).mockReturnValue('ana.bia123');
        vi.mocked(bcrypt.hash).mockResolvedValue('hash-reset' as never);
        vi.mocked(usuarioRepo.resetarSenhaUsuario).mockResolvedValue({
            id: 'u1',
        } as any);

        const resultado = await usuarioService.resetarSenha('u1');

        expect(usuarioRepo.buscarUsuarioPorId).toHaveBeenCalledWith('u1');
        expect(gerarSenhaPadrao).toHaveBeenCalledWith('ana.bia');
        expect(bcrypt.hash).toHaveBeenCalledWith('ana.bia123', 10);
        expect(usuarioRepo.resetarSenhaUsuario).toHaveBeenCalledWith(
            'u1',
            'hash-reset'
        );
        expect(resultado).toEqual({ id: 'u1' });
    });

    it('deve lançar erro quando usuário não é encontrado', async () => {
        vi.mocked(usuarioRepo.buscarUsuarioPorId).mockResolvedValue(
            null as any
        );

        await expect(
            usuarioService.resetarSenha('u-inexistente')
        ).rejects.toThrow('Usuário não encontrado');
    });
});