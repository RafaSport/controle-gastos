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
import { Compra, Corrida, MesFechado, Usuario } from '@/types';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    usuarioId: string;
}

const MESES = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
];

export default function PaginaCompradorAdminCliente({ usuarioId }: Props) {
    const router = useRouter();
    const hoje = new Date();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [compras, setCompras] = useState<Compra[]>([]);
    const [corridas, setCorridas] = useState<Corrida[]>([]);
    const [mesesFechados, setMesesFechados] = useState<MesFechado[]>([]);
    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth() + 1);
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
    const [carregando, setCarregando] = useState(true);
    const [carregandoUber, setCarregandoUber] = useState(false);

    const [modalCompra, setModalCompra] = useState(false);
    const [modalCorrida, setModalCorrida] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalPagamento, setModalPagamento] = useState(false);
    const [compraEditando, setCompraEditando] = useState<Compra | null>(null);

    async function buscarDados() {
        const [resUsuario, resCompras, resMeses] = await Promise.all([
            fetch(`/api/usuarios?id=${usuarioId}`),
            fetch(`/api/compras/usuario?id=${usuarioId}`),
            fetch(`/api/meses?id=${usuarioId}`),
        ]);
        const dadosUsuario = await resUsuario.json();
        const dadosCompras = await resCompras.json();
        const dadosMeses = await resMeses.json();

        setUsuario(dadosUsuario?.id ? dadosUsuario : null);
        setCompras(Array.isArray(dadosCompras) ? dadosCompras : []);
        setMesesFechados(Array.isArray(dadosMeses) ? dadosMeses : []);
        setCarregando(false);
    }

    useEffect(() => {
        buscarDados();
    }, [usuarioId]);

    useEffect(() => {
        if (!usuario?.usaUber) return;
        async function buscarCorridas() {
            setCarregandoUber(true);
            const res = await fetch(
                `/api/corridas/usuario?id=${usuarioId}&mes=${mesSelecionado}&ano=${anoSelecionado}`
            );
            const data = await res.json();
            setCorridas(Array.isArray(data) ? data : []);
            setCarregandoUber(false);
        }
        buscarCorridas();
    }, [usuario, mesSelecionado, anoSelecionado]);

    async function handleExcluirCompra(id: string) {
        if (!confirm('Excluir esta compra?')) return;
        await fetch(`/api/compras/${id}`, { method: 'DELETE' });
        buscarDados();
    }

    const mesesDisponiveis = useMemo(() => {
        const lista = [];
        for (let i = -3; i <= 9; i++) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
            const m = data.getMonth() + 1;
            const a = data.getFullYear();
            const fechado = mesesFechados.some(
                (mf) => mf.mes === m && mf.ano === a
            );
            lista.push({ mes: m, ano: a, fechado });
        }
        return lista;
    }, [mesesFechados]);

    const mesFechado = mesesFechados.find(
        (mf) => mf.mes === mesSelecionado && mf.ano === anoSelecionado
    );

    const comprasDoMes = compras.filter((c) => {
        const ini = c.anoInicio * 12 + c.mesInicio;
        const fim = c.anoFinal * 12 + c.mesFinal;
        const sel = anoSelecionado * 12 + mesSelecionado;
        return ini <= sel && fim >= sel;
    });

    const totalCompras = comprasDoMes.reduce(
        (acc, c) => acc + c.valorParcela,
        0
    );
    const totalUber = corridas.reduce((acc, c) => acc + c.valor, 0);

    // Dívida rolante — apenas a diferença do último mês fechado
    const ultimoMesFechado = mesesFechados
        .filter(
            (mf) => mf.ano * 12 + mf.mes < anoSelecionado * 12 + mesSelecionado
        )
        .sort((a, b) => b.ano * 12 + b.mes - (a.ano * 12 + a.mes))[0];

    const totalDivida = ultimoMesFechado
        ? Math.max(0, ultimoMesFechado.totalDoMes - ultimoMesFechado.totalPago)
        : 0;

    const totalMes = totalCompras + totalUber + totalDivida;

    if (carregando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Carregando...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <Header nomeUsuario="Admin" />

            <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col items-start">
                        <Botao
                            cor="cinza"
                            tamanho="sm"
                            icone={<ArrowLeft className="w-4 h-4" />}
                            onClick={() => router.push('/admin')}
                        >
                            Voltar
                        </Botao>
                        <h1 className="mt-2 text-lg font-semibold text-zinc-100">
                            {usuario?.nome} {usuario?.sobrenome}
                        </h1>
                        <p className="text-xs text-zinc-500">
                            {usuario?.login}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {usuario?.usaUber && (
                            <Botao
                                cor="amarelo"
                                tamanho="sm"
                                icone={<PlusCircle className="w-4 h-4" />}
                                onClick={() => setModalCorrida(true)}
                            >
                                Corrida
                            </Botao>
                        )}
                        <Botao
                            cor="verde"
                            tamanho="sm"
                            icone={<PlusCircle className="w-4 h-4" />}
                            onClick={() => setModalCompra(true)}
                        >
                            Compra
                        </Botao>
                    </div>
                </div>

                <SeletorMes
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                    mesAtual={hoje.getMonth() + 1}
                    anoAtual={hoje.getFullYear()}
                    mesesDisponiveis={mesesDisponiveis}
                    onChange={(mes, ano) => {
                        setMesSelecionado(mes);
                        setAnoSelecionado(ano);
                    }}
                />

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

                <TabelaCompras
                    compras={compras}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                    acoes={(compra) => (
                        <>
                            <Botao
                                cor="amarelo"
                                tamanho="sm"
                                onClick={() => {
                                    setCompraEditando(compra);
                                    setModalEditar(true);
                                }}
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

                {/* Rodapé com breakdown completo */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex flex-col gap-2">
                    {/* Status e botão de pagamento */}
                    <div className="flex items-center justify-between">
                        <Badge status={mesFechado ? 'finalizado' : 'aberto'} />
                        {!mesFechado && (
                            <Botao
                                cor="azul"
                                tamanho="sm"
                                onClick={() => setModalPagamento(true)}
                            >
                                Efetuar pagamento
                            </Botao>
                        )}
                        {mesFechado && (
                            <span className="text-xs text-zinc-500">
                                Pago: R${' '}
                                {mesFechado.totalPago
                                    .toFixed(2)
                                    .replace('.', ',')}
                            </span>
                        )}
                    </div>

                    {/* Breakdown dos valores */}
                    <div className="border-t border-zinc-800 pt-2 flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>Compras</span>
                            <span>
                                R$ {totalCompras.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        {totalUber > 0 && (
                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Uber</span>
                                <span>
                                    R$ {totalUber.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        )}
                        {totalDivida > 0 && (
                            <div className="flex justify-between text-xs text-red-400">
                                <span>Dívida anterior</span>
                                <span>
                                    R${' '}
                                    {totalDivida.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-bold text-zinc-100 border-t border-zinc-800 pt-1 mt-1">
                            <span>Total do mês</span>
                            <span>
                                R$ {totalMes.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            <ModalCadastroCompra
                aberto={modalCompra}
                usuarioId={usuarioId}
                onFechar={() => setModalCompra(false)}
                onSalvar={buscarDados}
            />

            <ModalCadastroCorrida
                aberto={modalCorrida}
                usuarioId={usuarioId}
                onFechar={() => setModalCorrida(false)}
                onSalvar={() => {
                    if (!usuario?.usaUber) return;
                    fetch(
                        `/api/corridas/usuario?id=${usuarioId}&mes=${mesSelecionado}&ano=${anoSelecionado}`
                    )
                        .then((r) => r.json())
                        .then((data) =>
                            setCorridas(Array.isArray(data) ? data : [])
                        );
                }}
            />

            <ModalEditarCompra
                aberto={modalEditar}
                compra={compraEditando}
                onFechar={() => {
                    setModalEditar(false);
                    setCompraEditando(null);
                }}
                onSalvar={buscarDados}
            />

            <ModalPagamento
                aberto={modalPagamento}
                totalDoMes={totalMes}
                usuarioId={usuarioId}
                mes={mesSelecionado}
                ano={anoSelecionado}
                onFechar={() => setModalPagamento(false)}
                onSalvar={buscarDados}
            />
        </div>
    );
}
