// src/app/(sistema)/comprador/PaginaCompradorCliente.tsx
// Dashboard do comprador — versão refatorada (M4.7)
//
// ANTES: ~270 linhas com busca, cálculos e renderização misturados
// DEPOIS: ~100 linhas — apenas renderização. Toda lógica em useResumoMensal hook

'use client';

import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import CardDividaAnterior from '@/components/ui/CardDividaAnterior';
import CardUber from '@/components/ui/CardUber';
import SeletorMes from '@/components/ui/SeletorMes';
import TabelaCompras from '@/components/ui/TabelaCompras';
import { useResumoMensal } from '@/hooks/useResumoMensal';

// ============================================
// INTERFACE — Props da página
// ============================================

interface Props {
    usuarioId: string;
    nomeUsuario: string;
}

// ============================================
// COMPONENTE PRINCIPAL — Apenas renderização
// ============================================

export default function PaginaCompradorCliente({
    usuarioId,
    nomeUsuario,
}: Props) {
    // ----------------------------------------
    // HOOK — Toda a lógica de busca e cálculos
    // ----------------------------------------
    const {
        usuario,
        compras,
        corridas,
        mesesFechados,
        carregando,
        carregandoUber,
        mesSelecionado,
        anoSelecionado,
        setMesSelecionado,
        setAnoSelecionado,
        mesEmAberto,
        anoEmAberto,
        mesesDisponiveis,
        mesFechado,
        totalCompras,
        totalUber,
        dividaAnterior,
        totalConsolidado,
    } = useResumoMensal({ usuarioId });

    // ----------------------------------------
    // LOADING STATE
    // ----------------------------------------
    if (carregando) {
        return (
            <div className="flex-1 flex items-center justify-center bg-zinc-950">
                <span className="text-zinc-500 text-sm">Carregando...</span>
            </div>
        );
    }

    // ----------------------------------------
    // RENDERIZAÇÃO
    // ----------------------------------------
    return (
        <div className="flex-1 bg-zinc-950">
            <Header nomeUsuario={nomeUsuario} />

            <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
                {/* Seletor de mês/ano */}
                <SeletorMes
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                    mesAtual={mesEmAberto}
                    anoAtual={anoEmAberto}
                    mesesDisponiveis={mesesDisponiveis}
                    onChange={(mes, ano) => {
                        setMesSelecionado(mes);
                        setAnoSelecionado(ano);
                    }}
                />

                {/* Card de corridas Uber (só se o usuário usa Uber) */}
                {usuario?.usaUber && (
                    <CardUber
                        usuarioId={usuarioId}
                        mes={mesSelecionado}
                        ano={anoSelecionado}
                        corridas={corridas}
                        carregando={carregandoUber}
                    />
                )}

                {/* Card de dívida anterior */}
                <CardDividaAnterior
                    mesesFechados={mesesFechados}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                />

                {/* Tabela de compras do mês — SEM ações (visão comprador) */}
                <TabelaCompras
                    compras={compras}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                />

                {/* Resumo financeiro do mês */}
                <ResumoFinanceiro
                    mesFechado={mesFechado}
                    totalCompras={totalCompras}
                    totalUber={totalUber}
                    dividaAnterior={dividaAnterior}
                    totalConsolidado={totalConsolidado}
                />
            </main>
        </div>
    );
}

// ============================================
// SUBCOMPONENTE — Resumo financeiro do mês
// Extraído para deixar a página ainda mais limpa
// ============================================

interface ResumoFinanceiroProps {
    mesFechado: { totalPago: number } | undefined;
    totalCompras: number;
    totalUber: number;
    dividaAnterior: number;
    totalConsolidado: number;
}

function ResumoFinanceiro({
    mesFechado,
    totalCompras,
    totalUber,
    dividaAnterior,
    totalConsolidado,
}: ResumoFinanceiroProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex flex-col gap-2">
            {/* Cabeçalho com status e pagamento */}
            <div className="flex items-center justify-between">
                <Badge status={mesFechado ? 'finalizado' : 'aberto'} />

                {mesFechado && (
                    <span className="text-xs text-zinc-500">
                        Pago: R${' '}
                        {mesFechado.totalPago.toFixed(2).replace('.', ',')}
                    </span>
                )}
            </div>

            {/* Detalhamento dos valores */}
            <div className="border-t border-zinc-800 pt-2 flex flex-col gap-1">
                {/* Total de compras */}
                <div className="flex justify-between text-xs text-zinc-500">
                    <span>Compras</span>
                    <span>R$ {totalCompras.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* Total de Uber (só mostra se > 0) */}
                {totalUber > 0 && (
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Uber</span>
                        <span>R$ {totalUber.toFixed(2).replace('.', ',')}</span>
                    </div>
                )}

                {/* Dívida anterior (só mostra se > 0) */}
                {dividaAnterior > 0 && (
                    <div className="flex justify-between text-xs text-red-400">
                        <span>Dívida anterior</span>
                        <span>
                            R$ {dividaAnterior.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                )}

                {/* Total consolidado */}
                <div className="flex justify-between text-sm font-bold text-zinc-100 border-t border-zinc-800 pt-1 mt-1">
                    <span>Total do mês</span>
                    <span>
                        R$ {totalConsolidado.toFixed(2).replace('.', ',')}
                    </span>
                </div>
            </div>
        </div>
    );
}