import * as compraRepo from '@/repositories/compra.repository';
import * as compraService from '@/services/compra.service';
import { describe, expect, it, vi } from 'vitest';

// ============================================
// MOCKS
// ============================================

// Mocka todo o módulo de repository para isolar os testes do banco de dados
vi.mock('@/repositories/compra.repository', () => ({
    buscarComprasPorUsuario: vi.fn(),
    criarCompra: vi.fn(),
    atualizarCompra: vi.fn(),
    deletarCompra: vi.fn(),
}));

// Mocka o enum Cartao do Prisma (valor usado no cast do service)
vi.mock('@prisma/client', () => ({
    Cartao: {
        NUBANK: 'NUBANK',
        INTER: 'INTER',
        HIPER: 'HIPER',
        ITAU: 'ITAU',
    },
}));

// ============================================
// SUITE: listarCompras
// ============================================
describe('listarCompras', () => {
    it('deve retornar a lista de compras do usuário', async () => {
        const mockCompras = [
            { id: '1', descricao: 'Compra 1', valorParcela: 100 },
            { id: '2', descricao: 'Compra 2', valorParcela: 200 },
        ];
        vi.mocked(compraRepo.buscarComprasPorUsuario).mockResolvedValue(
            mockCompras as any
        );

        const resultado = await compraService.listarCompras('user-123');

        expect(compraRepo.buscarComprasPorUsuario).toHaveBeenCalledWith(
            'user-123'
        );
        expect(compraRepo.buscarComprasPorUsuario).toHaveBeenCalledTimes(1);
        expect(resultado).toEqual(mockCompras);
    });
});

// ============================================
// SUITE: cadastrarCompra
// ============================================
describe('cadastrarCompra', () => {
    it('deve cadastrar compra calculando mês final automaticamente', async () => {
        const dadosEntrada = {
            usuarioId: 'user-123',
            cartao: 'NUBANK',
            descricao: 'Notebook',
            mesCompra: 5,
            anoCompra: 2025,
            mesInicio: 5,
            anoInicio: 2025,
            qtdParcelas: 3,
            valorParcela: 500.0,
        };

        const mockRetorno = {
            id: 'compra-1',
            ...dadosEntrada,
            mesFinal: 7,
            anoFinal: 2025,
        };
        vi.mocked(compraRepo.criarCompra).mockResolvedValue(mockRetorno as any);

        const resultado = await compraService.cadastrarCompra(dadosEntrada);

        // Verifica se o repository foi chamado com os dados corretos
        expect(compraRepo.criarCompra).toHaveBeenCalledTimes(1);
        expect(compraRepo.criarCompra).toHaveBeenCalledWith(
            expect.objectContaining({
                cartao: 'NUBANK', // cast para enum do Prisma
                descricao: 'Notebook',
                mesFinal: 7,
                anoFinal: 2025,
                qtdParcelas: 3,
                valorParcela: 500.0,
                usuario: { connect: { id: 'user-123' } },
            })
        );
        expect(resultado).toEqual(mockRetorno);
    });

    it('deve calcular virada de ano corretamente', async () => {
        const dadosEntrada = {
            usuarioId: 'user-456',
            cartao: 'INTER',
            descricao: 'TV',
            mesCompra: 11,
            anoCompra: 2025,
            mesInicio: 11,
            anoInicio: 2025,
            qtdParcelas: 3,
            valorParcela: 300,
        };

        vi.mocked(compraRepo.criarCompra).mockResolvedValue({} as any);

        await compraService.cadastrarCompra(dadosEntrada);

        expect(compraRepo.criarCompra).toHaveBeenCalledWith(
            expect.objectContaining({
                mesFinal: 1,
                anoFinal: 2026,
            })
        );
    });
});

// ============================================
// SUITE: editarCompra
// ============================================
describe('editarCompra', () => {
    it('deve editar compra sem recalcular quando não há dados de parcela', async () => {
        const dados = { descricao: 'Novo nome' };
        vi.mocked(compraRepo.atualizarCompra).mockResolvedValue({
            id: '1',
            ...dados,
        } as any);

        await compraService.editarCompra('compra-1', dados);

        expect(compraRepo.atualizarCompra).toHaveBeenCalledWith('compra-1', {
            descricao: 'Novo nome',
        });
    });

    it('deve recalcular mês final quando altera início/parcelas', async () => {
        const dados = {
            mesInicio: 6,
            anoInicio: 2025,
            qtdParcelas: 6,
            descricao: 'Alterado',
        };
        vi.mocked(compraRepo.atualizarCompra).mockResolvedValue({} as any);

        await compraService.editarCompra('compra-2', dados);

        // 6 + 6 - 1 = 11 → mês 11, mesmo ano 2025
        expect(compraRepo.atualizarCompra).toHaveBeenCalledWith(
            'compra-2',
            expect.objectContaining({
                mesFinal: 11,
                anoFinal: 2025,
                descricao: 'Alterado',
            })
        );
    });

    it('deve remover usuarioId dos dados (não pode atualizar relação)', async () => {
        const dados = {
            usuarioId: 'user-999',
            descricao: 'Teste',
        } as any;
        vi.mocked(compraRepo.atualizarCompra).mockResolvedValue({} as any);

        await compraService.editarCompra('compra-3', dados);

        const chamada = vi.mocked(compraRepo.atualizarCompra).mock.calls[0][1];
        expect(chamada).not.toHaveProperty('usuarioId');
    });
});

// ============================================
// SUITE: removerCompra
// ============================================
describe('removerCompra', () => {
    it('deve chamar repository para deletar compra', async () => {
        vi.mocked(compraRepo.deletarCompra).mockResolvedValue({} as any);

        await compraService.removerCompra('compra-99');

        expect(compraRepo.deletarCompra).toHaveBeenCalledWith('compra-99');
        expect(compraRepo.deletarCompra).toHaveBeenCalledTimes(1);
    });
});