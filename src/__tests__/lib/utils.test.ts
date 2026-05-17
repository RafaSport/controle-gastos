import {
    buscarUltimoMesFechado,
    calcularDividaAnterior,
    calcularMesFinal,
    calcularTotalComprasNoMes,
    calcularTotalConsolidado,
    compraEstaAtivaNoMes,
    encontrarPrimeiroMesEmAberto,
    gerarLogin,
    gerarMesesDisponiveis,
    gerarSenhaPadrao,
    paraIndiceMes,
} from '@/lib/utils';
import { describe, expect, it } from 'vitest';

// ============================================
// SUITE: gerarLogin
// ============================================
describe('gerarLogin', () => {
    it('deve gerar login no formato nome.sobrenome em minúsculas', () => {
        expect(gerarLogin('Ana', 'Bia')).toBe('ana.bia');
    });

    it('deve remover acentos e caracteres especiais', () => {
        expect(gerarLogin('José', 'São João')).toBe('jose.sao joao');
    });

    it('deve remover espaços nas extremidades', () => {
        expect(gerarLogin('  Maria  ', '  Silva  ')).toBe('maria.silva');
    });
});

// ============================================
// SUITE: gerarSenhaPadrao
// ============================================
describe('gerarSenhaPadrao', () => {
    it('deve concatenar login com sufixo padrão', () => {
        expect(gerarSenhaPadrao('ana.bia')).toBe('ana.bia123');
    });

    it('deve usar sufixo customizado quando SENHA_PADRAO_SUFFIX está definido', () => {
        // Simula a variável de ambiente
        const originalEnv = process.env.SENHA_PADRAO_SUFFIX;
        process.env.SENHA_PADRAO_SUFFIX = '456';

        // Recarrega o módulo para pegar o novo valor (simulação simples)
        // Como SENHA_PADRAO_SUFFIX é lido no topo do arquivo, mockamos direto
        expect(gerarSenhaPadrao('joao.silva')).toBe('joao.silva456');

        process.env.SENHA_PADRAO_SUFFIX = originalEnv;
    });
});

// ============================================
// SUITE: calcularMesFinal
// ============================================
describe('calcularMesFinal', () => {
    it('deve calcular mês final dentro do mesmo ano', () => {
        const resultado = calcularMesFinal(5, 2025, 3);
        expect(resultado).toEqual({ mesFinal: 7, anoFinal: 2025 });
    });

    it('deve calcular mês final com virada de ano', () => {
        const resultado = calcularMesFinal(11, 2025, 3);
        expect(resultado).toEqual({ mesFinal: 1, anoFinal: 2026 });
    });

    it('deve calcular corretamente para 12 parcelas (1 ano completo)', () => {
        const resultado = calcularMesFinal(1, 2025, 12);
        expect(resultado).toEqual({ mesFinal: 12, anoFinal: 2025 });
    });

    it('deve calcular corretamente para 13 parcelas (ultrapassa 1 ano)', () => {
        const resultado = calcularMesFinal(1, 2025, 13);
        expect(resultado).toEqual({ mesFinal: 1, anoFinal: 2026 });
    });
});

// ============================================
// SUITE: paraIndiceMes
// ============================================
describe('paraIndiceMes', () => {
    it('deve converter mês/ano para índice numérico', () => {
        expect(paraIndiceMes(1, 2025)).toBe(2025 * 12 + 1); // 24301
        expect(paraIndiceMes(12, 2025)).toBe(2025 * 12 + 12); // 24312
    });
});

// ============================================
// SUITE: compraEstaAtivaNoMes
// ============================================
describe('compraEstaAtivaNoMes', () => {
    const compra = {
        mesInicio: 3,
        anoInicio: 2025,
        mesFinal: 6,
        anoFinal: 2025,
    };

    it('deve retornar true quando o mês está dentro do período', () => {
        expect(compraEstaAtivaNoMes(compra, 4, 2025)).toBe(true);
    });

    it('deve retornar true no mês inicial', () => {
        expect(compraEstaAtivaNoMes(compra, 3, 2025)).toBe(true);
    });

    it('deve retornar true no mês final', () => {
        expect(compraEstaAtivaNoMes(compra, 6, 2025)).toBe(true);
    });

    it('deve retornar false antes do mês inicial', () => {
        expect(compraEstaAtivaNoMes(compra, 2, 2025)).toBe(false);
    });

    it('deve retornar false após o mês final', () => {
        expect(compraEstaAtivaNoMes(compra, 7, 2025)).toBe(false);
    });

    it('deve retornar false em ano diferente', () => {
        expect(compraEstaAtivaNoMes(compra, 4, 2024)).toBe(false);
    });
});

// ============================================
// SUITE: calcularTotalComprasNoMes
// ============================================
describe('calcularTotalComprasNoMes', () => {
    const compras = [
        {
            mesInicio: 1,
            anoInicio: 2025,
            mesFinal: 3,
            anoFinal: 2025,
            valorParcela: 100,
        },
        {
            mesInicio: 2,
            anoInicio: 2025,
            mesFinal: 4,
            anoFinal: 2025,
            valorParcela: 200,
        },
        {
            mesInicio: 5,
            anoInicio: 2025,
            mesFinal: 6,
            anoFinal: 2025,
            valorParcela: 300,
        },
    ];

    it('deve somar apenas compras ativas no mês selecionado', () => {
        // Mês 2/2025: compra 1 e 2 estão ativas → 100 + 200 = 300
        expect(calcularTotalComprasNoMes(compras, 2, 2025)).toBe(300);
    });

    it('deve retornar 0 quando nenhuma compra está ativa', () => {
        // Mês 7/2025: nenhuma compra ativa
        expect(calcularTotalComprasNoMes(compras, 7, 2025)).toBe(0);
    });

    it('deve retornar valor de uma única compra ativa', () => {
        // Mês 5/2025: apenas compra 3 está ativa
        expect(calcularTotalComprasNoMes(compras, 5, 2025)).toBe(300);
    });
});

// ============================================
// SUITE: buscarUltimoMesFechado
// ============================================
describe('buscarUltimoMesFechado', () => {
    const mesesFechados = [
        { mes: 1, ano: 2025, totalDoMes: 1000, totalPago: 800 },
        { mes: 3, ano: 2025, totalDoMes: 1200, totalPago: 1200 },
        { mes: 2, ano: 2025, totalDoMes: 900, totalPago: 500 },
    ];

    it('deve retornar o mês fechado mais recente anterior ao período', () => {
        // Abril/2025 → último anterior é março/2025
        const resultado = buscarUltimoMesFechado(mesesFechados, 4, 2025);
        expect(resultado).toEqual({
            mes: 3,
            ano: 2025,
            totalDoMes: 1200,
            totalPago: 1200,
        });
    });

    it('deve retornar null quando não há meses fechados anteriores', () => {
        const resultado = buscarUltimoMesFechado(mesesFechados, 1, 2025);
        expect(resultado).toBeNull();
    });
});

// ============================================
// SUITE: calcularDividaAnterior
// ============================================
describe('calcularDividaAnterior', () => {
    it('deve calcular dívida como totalDoMes - totalPago', () => {
        const meses = [{ mes: 1, ano: 2025, totalDoMes: 1000, totalPago: 600 }];
        expect(calcularDividaAnterior(meses, 2, 2025)).toBe(400);
    });

    it('deve retornar 0 quando não há dívida (pago integralmente)', () => {
        const meses = [
            { mes: 1, ano: 2025, totalDoMes: 1000, totalPago: 1000 },
        ];
        expect(calcularDividaAnterior(meses, 2, 2025)).toBe(0);
    });

    it('deve retornar 0 quando não há meses fechados anteriores', () => {
        expect(calcularDividaAnterior([], 2, 2025)).toBe(0);
    });

    it('não deve retornar valor negativo (se pagou a mais)', () => {
        const meses = [
            { mes: 1, ano: 2025, totalDoMes: 1000, totalPago: 1200 },
        ];
        expect(calcularDividaAnterior(meses, 2, 2025)).toBe(0);
    });
});

// ============================================
// SUITE: calcularTotalConsolidado
// ============================================
describe('calcularTotalConsolidado', () => {
    it('deve somar compras, uber e dívida anterior', () => {
        expect(calcularTotalConsolidado(500, 100, 200)).toBe(800);
    });

    it('deve funcionar com valores zerados', () => {
        expect(calcularTotalConsolidado(0, 0, 0)).toBe(0);
    });
});

// ============================================
// SUITE: encontrarPrimeiroMesEmAberto
// ============================================
describe('encontrarPrimeiroMesEmAberto', () => {
    it('deve retornar mês atual se não estiver fechado', () => {
        const fechados = [{ mes: 1, ano: 2025 }];
        expect(encontrarPrimeiroMesEmAberto(fechados, 2, 2025)).toEqual({
            mes: 2,
            ano: 2025,
        });
    });

    it('deve avançar até encontrar mês em aberto', () => {
        const fechados = [
            { mes: 3, ano: 2025 },
            { mes: 4, ano: 2025 },
        ];
        expect(encontrarPrimeiroMesEmAberto(fechados, 3, 2025)).toEqual({
            mes: 5,
            ano: 2025,
        });
    });

    it('deve virar o ano quando necessário', () => {
        const fechados = [{ mes: 12, ano: 2025 }];
        expect(encontrarPrimeiroMesEmAberto(fechados, 12, 2025)).toEqual({
            mes: 1,
            ano: 2026,
        });
    });
});

// ============================================
// SUITE: gerarMesesDisponiveis
// ============================================
describe('gerarMesesDisponiveis', () => {
    it('deve gerar 13 meses (-2 até +10)', () => {
        const resultado = gerarMesesDisponiveis([], 6, 2025);
        expect(resultado).toHaveLength(13);
    });

    it('deve marcar meses fechados corretamente', () => {
        const fechados = [{ mes: 6, ano: 2025 }];
        const resultado = gerarMesesDisponiveis(fechados, 6, 2025);
        const mesFechado = resultado.find((r) => r.mes === 6 && r.ano === 2025);
        expect(mesFechado?.fechado).toBe(true);
    });

    it('deve marcar meses em aberto corretamente', () => {
        const resultado = gerarMesesDisponiveis([], 6, 2025);
        const mesAberto = resultado.find((r) => r.mes === 6 && r.ano === 2025);
        expect(mesAberto?.fechado).toBe(false);
    });
});