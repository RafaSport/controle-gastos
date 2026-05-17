import * as compraRepo from '@/repositories/compra.repository';
import * as corridaRepo from '@/repositories/corrida.repository';
import * as mesRepo from '@/repositories/mes.repository';
import * as mesService from '@/services/mes.service';
import { describe, expect, it, vi } from 'vitest';

// ============================================
// MOCKS
// ============================================

vi.mock('@/repositories/compra.repository', () => ({
    buscarComprasPorUsuario: vi.fn(),
}));

vi.mock('@/repositories/corrida.repository', () => ({
    buscarCorridasDoMes: vi.fn(),
}));

vi.mock('@/repositories/mes.repository', () => ({
    buscarMesesFechados: vi.fn(),
    fecharMes: vi.fn(),
}));

// ============================================
// SUITE: listarMesesFechados
// ============================================
describe('listarMesesFechados', () => {
    it('deve retornar meses fechados do usuário', async () => {
        const mockMeses = [
            { mes: 1, ano: 2025, totalDoMes: 1000, totalPago: 800 },
            { mes: 2, ano: 2025, totalDoMes: 1200, totalPago: 1200 },
        ];
        vi.mocked(mesRepo.buscarMesesFechados).mockResolvedValue(
            mockMeses as any
        );

        const resultado = await mesService.listarMesesFechados('user-123');

        expect(mesRepo.buscarMesesFechados).toHaveBeenCalledWith('user-123');
        expect(resultado).toEqual(mockMeses);
    });
});

// ============================================
// SUITE: fecharMes
// ============================================
describe('fecharMes', () => {
    it('deve calcular totalDoMes = compras + corridas + dividaAnterior', async () => {
        // Compras: 2 ativas no mês 5/2025
        vi.mocked(compraRepo.buscarComprasPorUsuario).mockResolvedValue([
            {
                mesInicio: 3,
                anoInicio: 2025,
                mesFinal: 6,
                anoFinal: 2025,
                valorParcela: 100,
            },
            {
                mesInicio: 1,
                anoInicio: 2025,
                mesFinal: 12,
                anoFinal: 2025,
                valorParcela: 200,
            },
            {
                mesInicio: 6,
                anoInicio: 2025,
                mesFinal: 8,
                anoFinal: 2025,
                valorParcela: 50,
            }, // inativa em maio
        ] as any);

        // Corridas: 2 corridas no mês
        vi.mocked(corridaRepo.buscarCorridasDoMes).mockResolvedValue([
            { valor: 30 },
            { valor: 20 },
        ] as any);

        // Meses anteriores fechados: dívida de 100 no mês 4/2025
        vi.mocked(mesRepo.buscarMesesFechados).mockResolvedValue([
            { mes: 4, ano: 2025, totalDoMes: 500, totalPago: 400 }, // dívida = 100
        ] as any);

        vi.mocked(mesRepo.fecharMes).mockResolvedValue({ id: 'mf-1' } as any);

        await mesService.fecharMes('user-123', 5, 2025, 450);

        // totalCompras = 100 + 200 = 300
        // totalCorridas = 30 + 20 = 50
        // dividaAnterior = 500 - 400 = 100
        // totalDoMes = 300 + 50 + 100 = 450
        expect(mesRepo.fecharMes).toHaveBeenCalledWith(
            expect.objectContaining({
                usuarioId: 'user-123',
                mes: 5,
                ano: 2025,
                totalDoMes: 450,
                totalPago: 450,
                dividaAnterior: 100,
            })
        );
    });

    it('deve retornar dividaAnterior = 0 quando não há meses anteriores fechados', async () => {
        vi.mocked(compraRepo.buscarComprasPorUsuario).mockResolvedValue([
            {
                mesInicio: 5,
                anoInicio: 2025,
                mesFinal: 5,
                anoFinal: 2025,
                valorParcela: 300,
            },
        ] as any);
        vi.mocked(corridaRepo.buscarCorridasDoMes).mockResolvedValue([] as any);
        vi.mocked(mesRepo.buscarMesesFechados).mockResolvedValue([] as any);
        vi.mocked(mesRepo.fecharMes).mockResolvedValue({} as any);

        await mesService.fecharMes('user-123', 5, 2025, 300);

        expect(mesRepo.fecharMes).toHaveBeenCalledWith(
            expect.objectContaining({
                totalDoMes: 300,
                dividaAnterior: 0,
            })
        );
    });

    it('deve retornar dividaAnterior = 0 quando dívida é negativa (pagou a mais)', async () => {
        vi.mocked(compraRepo.buscarComprasPorUsuario).mockResolvedValue(
            [] as any
        );
        vi.mocked(corridaRepo.buscarCorridasDoMes).mockResolvedValue([] as any);
        vi.mocked(mesRepo.buscarMesesFechados).mockResolvedValue([
            { mes: 4, ano: 2025, totalDoMes: 500, totalPago: 600 }, // "dívida" = -100 → 0
        ] as any);
        vi.mocked(mesRepo.fecharMes).mockResolvedValue({} as any);

        await mesService.fecharMes('user-123', 5, 2025, 0);

        expect(mesRepo.fecharMes).toHaveBeenCalledWith(
            expect.objectContaining({
                totalDoMes: 0,
                dividaAnterior: 0,
            })
        );
    });

    it('deve filtrar apenas compras ativas no mês selecionado', async () => {
        // Compra ativa apenas em junho/2025, mas estamos fechando maio/2025
        vi.mocked(compraRepo.buscarComprasPorUsuario).mockResolvedValue([
            {
                mesInicio: 6,
                anoInicio: 2025,
                mesFinal: 8,
                anoFinal: 2025,
                valorParcela: 999,
            },
        ] as any);
        vi.mocked(corridaRepo.buscarCorridasDoMes).mockResolvedValue([] as any);
        vi.mocked(mesRepo.buscarMesesFechados).mockResolvedValue([] as any);
        vi.mocked(mesRepo.fecharMes).mockResolvedValue({} as any);

        await mesService.fecharMes('user-123', 5, 2025, 0);

        // Compra não está ativa em maio (início em junho)
        expect(mesRepo.fecharMes).toHaveBeenCalledWith(
            expect.objectContaining({
                totalDoMes: 0,
            })
        );
    });

    it('deve escolher o mês fechado mais recente anterior para a dívida', async () => {
        vi.mocked(compraRepo.buscarComprasPorUsuario).mockResolvedValue(
            [] as any
        );
        vi.mocked(corridaRepo.buscarCorridasDoMes).mockResolvedValue([] as any);

        // Vários meses fechados — deve pegar o mais recente ANTERIOR ao mês atual
        vi.mocked(mesRepo.buscarMesesFechados).mockResolvedValue([
            { mes: 1, ano: 2025, totalDoMes: 100, totalPago: 50 }, // dívida 50
            { mes: 3, ano: 2025, totalDoMes: 200, totalPago: 150 }, // dívida 50 ← mais recente anterior
            { mes: 5, ano: 2025, totalDoMes: 300, totalPago: 300 }, // mesmo mês (não conta)
            { mes: 6, ano: 2025, totalDoMes: 400, totalPago: 0 }, // futuro (não conta)
        ] as any);
        vi.mocked(mesRepo.fecharMes).mockResolvedValue({} as any);

        await mesService.fecharMes('user-123', 5, 2025, 0);

        // Índice maio/2025 = 2025*12 + 5 = 24305
        // Março/2025 = 24303 (mais recente anterior)
        // Dívida = 200 - 150 = 50
        expect(mesRepo.fecharMes).toHaveBeenCalledWith(
            expect.objectContaining({
                dividaAnterior: 50,
            })
        );
    });
});