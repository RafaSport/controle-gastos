import * as corridaRepo from '@/repositories/corrida.repository';
import * as corridaService from '@/services/corrida.service';
import { describe, expect, it, vi } from 'vitest';

// ============================================
// MOCKS
// ============================================

vi.mock('@/repositories/corrida.repository', () => ({
    buscarCorridasDoMes: vi.fn(),
    criarCorrida: vi.fn(),
    deletarCorrida: vi.fn(),
}));

// ============================================
// SUITE: listarCorridas
// ============================================
describe('listarCorridas', () => {
    it('deve retornar corridas do mês do usuário', async () => {
        const mockCorridas = [
            { id: 'c1', valor: 25.5, data: new Date('2025-05-10') },
            { id: 'c2', valor: 18.0, data: new Date('2025-05-15') },
        ];
        vi.mocked(corridaRepo.buscarCorridasDoMes).mockResolvedValue(
            mockCorridas as any
        );

        const resultado = await corridaService.listarCorridas(
            'user-123',
            5,
            2025
        );

        expect(corridaRepo.buscarCorridasDoMes).toHaveBeenCalledWith(
            'user-123',
            5,
            2025
        );
        expect(resultado).toEqual(mockCorridas);
    });
});

// ============================================
// SUITE: cadastrarCorrida
// ============================================
describe('cadastrarCorrida', () => {
    it('deve criar data local ao meio-dia evitando deslocamento UTC', async () => {
        vi.mocked(corridaRepo.criarCorrida).mockResolvedValue({
            id: 'c-new',
        } as any);

        await corridaService.cadastrarCorrida({
            usuarioId: 'user-123',
            data: '2025-05-20',
            mesReferencia: 5,
            anoReferencia: 2025,
            valor: 45.9,
        });

        const chamada = vi.mocked(corridaRepo.criarCorrida).mock.calls[0][0];

        // Verifica se a data foi criada corretamente (ano, mês, dia, 12h)
        expect(chamada.data).toBeInstanceOf(Date);
        expect(chamada.data.getFullYear()).toBe(2025);
        expect(chamada.data.getMonth()).toBe(4); // maio = índice 4
        expect(chamada.data.getDate()).toBe(20);
        expect(chamada.data.getHours()).toBe(12);
        expect(chamada.data.getMinutes()).toBe(0);
        expect(chamada.data.getSeconds()).toBe(0);

        // Verifica demais campos
        expect(chamada).toMatchObject({
            usuarioId: 'user-123',
            mesReferencia: 5,
            anoReferencia: 2025,
            valor: 45.9,
        });
    });

    it('deve funcionar com virada de ano', async () => {
        vi.mocked(corridaRepo.criarCorrida).mockResolvedValue({} as any);

        await corridaService.cadastrarCorrida({
            usuarioId: 'user-456',
            data: '2025-12-31',
            mesReferencia: 12,
            anoReferencia: 2025,
            valor: 99.99,
        });

        const chamada = vi.mocked(corridaRepo.criarCorrida).mock.calls[0][0];
        expect(chamada.data.getFullYear()).toBe(2025);
        expect(chamada.data.getMonth()).toBe(11); // dezembro = índice 11
        expect(chamada.data.getDate()).toBe(31);
    });
});

// ============================================
// SUITE: removerCorrida
// ============================================
describe('removerCorrida', () => {
    it('deve chamar repository para deletar corrida', async () => {
        vi.mocked(corridaRepo.deletarCorrida).mockResolvedValue({} as any);

        await corridaService.removerCorrida('corrida-99');

        expect(corridaRepo.deletarCorrida).toHaveBeenCalledWith('corrida-99');
        expect(corridaRepo.deletarCorrida).toHaveBeenCalledTimes(1);
    });
});