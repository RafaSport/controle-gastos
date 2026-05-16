// Dashboard do comprador (visão admin) — versão refatorada
// ANTES: tina busca, cálculos, ações e modais misturados
// DEPOIS: lógica financeira no hook, ações admin na página

'use client';

import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import Botao from '@/components/ui/Botao';
import CardDividaAnterior from '@/components/ui/CardDividaAnterior';
import CardUber from '@/components/ui/CardUber';
import ModalCadastroCompra from '@/components/ui/ModalCadastroCompra';
import ModalCadastroCorrida from '@/components/ui/ModalCadastroCorrida';
import ModalEditarCompra from '@/components/ui/ModalEditarCompra';
import ModalPagamento from '@/components/ui/ModalPagamento';
import SeletorMes from '@/components/ui/SeletorMes';
import TabelaCompras from '@/components/ui/TabelaCompras';
import { useResumoMensal } from '@/hooks/useResumoMensal';
import { Compra } from '@/types';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ============================================
// INTERFACE — Props da página
// ============================================

interface Props {
    usuarioId: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function PaginaCompradorAdminCliente({ usuarioId }: Props) {
    const router = useRouter();

    // ----------------------------------------
    // HOOK — Lógica financeira compartilhada
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
        recarregar,
    } = useResumoMensal({ usuarioId });

    // ----------------------------------------
    // ESTADOS LOCAIS — Apenas UI e modais (específico do admin)
    // ----------------------------------------
    const [modalCompra, setModalCompra] = useState(false);
    const [modalCorrida, setModalCorrida] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalPagamento, setModalPagamento] = useState(false);
    const [compraEditando, setCompraEditando] = useState<Compra | null>(null);

    // ----------------------------------------
    // AÇÕES ADMIN — Específicas desta página
    // ----------------------------------------

    /** Exclui uma compra após confirmação */
    async function handleExcluirCompra(id: string) {
        if (!confirm('Excluir esta compra?')) return;

        await fetch(`/api/compras/${id}`, { method: 'DELETE' });
        recarregar(); // Recarrega dados do hook
    }

    /** Abre modal de edição com a compra selecionada */
    function handleEditarCompra(compra: Compra) {
        setCompraEditando(compra);
        setModalEditar(true);
    }

    // ----------------------------------------
    // LOADING STATE
    // ----------------------------------------
    if (carregando) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Carregando...</span>
            </div>
        );
    }

    // ----------------------------------------
    // RENDERIZAÇÃO
    // ----------------------------------------
    return (
        <div className="flex-1 bg-zinc-950">
            <Header nomeUsuario="Admin" />

            <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
                {/* Cabeçalho com nome do comprador e ações */}
                <CabecalhoAdmin
                    usuario={usuario}
                    usaUber={usuario?.usaUber ?? false}
                    onVoltar={() => router.push('/admin')}
                    onNovaCorrida={() => setModalCorrida(true)}
                    onNovaCompra={() => setModalCompra(true)}
                />

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

                {/* Card de corridas Uber */}
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

                {/* Tabela de compras com ações de admin */}
                <TabelaCompras
                    compras={compras}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                    acoes={(compra) => (
                        <>
                            <Botao
                                cor="amarelo"
                                tamanho="sm"
                                onClick={() => handleEditarCompra(compra)}
                            >
                                Editar
                            </Botao>
                            <Botao
                                cor="vermelho"
                                tamanho="sm"
                                onClick={() => handleExcluirCompra(compra.id)}
                            >
                                Excluir
                            </Botao>
                        </>
                    )}
                />

                {/* Resumo financeiro com ação de pagamento */}
                <ResumoFinanceiroAdmin
                    mesFechado={mesFechado}
                    totalCompras={totalCompras}
                    totalUber={totalUber}
                    dividaAnterior={dividaAnterior}
                    totalConsolidado={totalConsolidado}
                    onEfetuarPagamento={() => setModalPagamento(true)}
                />
            </main>

            {/* Modais */}
            <ModalCadastroCompra
                aberto={modalCompra}
                usuarioId={usuarioId}
                onFechar={() => setModalCompra(false)}
                onSalvar={recarregar}
            />

            <ModalCadastroCorrida
                aberto={modalCorrida}
                usuarioId={usuarioId}
                mesEmAberto={mesEmAberto}
                anoEmAberto={anoEmAberto}
                onFechar={() => setModalCorrida(false)}
                onSalvar={() => {
                    if (!usuario?.usaUber) return;
                    fetch(
                        `/api/corridas/usuario?id=${usuarioId}&mes=${mesEmAberto}&ano=${anoEmAberto}`
                    )
                        .then((r) => r.json())
                        .then((data) => recarregar());
                }}
            />

            <ModalEditarCompra
                aberto={modalEditar}
                compra={compraEditando}
                onFechar={() => {
                    setModalEditar(false);
                    setCompraEditando(null);
                }}
                onSalvar={recarregar}
            />

            <ModalPagamento
                aberto={modalPagamento}
                totalDoMes={totalConsolidado}
                usuarioId={usuarioId}
                mes={mesSelecionado}
                ano={anoSelecionado}
                onFechar={() => setModalPagamento(false)}
                onSalvar={recarregar}
            />
        </div>
    );
}

// ============================================
// SUBCOMPONENTE — Cabeçalho com dados do comprador e ações
// ============================================

interface CabecalhoAdminProps {
    usuario: { nome?: string; sobrenome?: string; login?: string } | null;
    usaUber: boolean;
    onVoltar: () => void;
    onNovaCorrida: () => void;
    onNovaCompra: () => void;
}

function CabecalhoAdmin({
    usuario,
    usaUber,
    onVoltar,
    onNovaCorrida,
    onNovaCompra,
}: CabecalhoAdminProps) {
    return (
        <div className="flex items-start justify-between">
            <div className="flex flex-col items-start">
                <Botao
                    cor="cinza"
                    tamanho="sm"
                    icone={<ArrowLeft className="w-4 h-4" />}
                    onClick={onVoltar}
                >
                    Voltar
                </Botao>
                <h1 className="mt-2 text-lg font-semibold text-zinc-100">
                    {usuario?.nome} {usuario?.sobrenome}
                </h1>
                <p className="text-xs text-zinc-500">{usuario?.login}</p>
            </div>

            <div className="flex gap-2">
                {usaUber && (
                    <Botao
                        cor="amarelo"
                        tamanho="sm"
                        icone={<PlusCircle className="w-4 h-4" />}
                        onClick={onNovaCorrida}
                    >
                        Corrida
                    </Botao>
                )}
                <Botao
                    cor="verde"
                    tamanho="sm"
                    icone={<PlusCircle className="w-4 h-4" />}
                    onClick={onNovaCompra}
                >
                    Compra
                </Botao>
            </div>
        </div>
    );
}

// ============================================
// SUBCOMPONENTE — Resumo financeiro com ação de pagamento (admin)
// ============================================

interface ResumoFinanceiroAdminProps {
    mesFechado: { totalPago: number } | undefined;
    totalCompras: number;
    totalUber: number;
    dividaAnterior: number;
    totalConsolidado: number;
    onEfetuarPagamento: () => void;
}

function ResumoFinanceiroAdmin({
    mesFechado,
    totalCompras,
    totalUber,
    dividaAnterior,
    totalConsolidado,
    onEfetuarPagamento,
}: ResumoFinanceiroAdminProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex flex-col gap-2">
            {/* Cabeçalho com status e botão de pagamento */}
            <div className="flex items-center justify-between">
                <Badge status={mesFechado ? 'finalizado' : 'aberto'} />

                {!mesFechado && (
                    <Botao cor="azul" tamanho="sm" onClick={onEfetuarPagamento}>
                        Efetuar pagamento
                    </Botao>
                )}

                {mesFechado && (
                    <span className="text-xs text-zinc-500">
                        Pago: R${' '}
                        {mesFechado.totalPago.toFixed(2).replace('.', ',')}
                    </span>
                )}
            </div>

            {/* Detalhamento dos valores */}
            <div className="border-t border-zinc-800 pt-2 flex flex-col gap-1">
                <div className="flex justify-between text-xs text-zinc-500">
                    <span>Compras</span>
                    <span>R$ {totalCompras.toFixed(2).replace('.', ',')}</span>
                </div>

                {totalUber > 0 && (
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Uber</span>
                        <span>R$ {totalUber.toFixed(2).replace('.', ',')}</span>
                    </div>
                )}

                {dividaAnterior > 0 && (
                    <div className="flex justify-between text-xs text-red-400">
                        <span>Dívida anterior</span>
                        <span>
                            R$ {dividaAnterior.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                )}

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
