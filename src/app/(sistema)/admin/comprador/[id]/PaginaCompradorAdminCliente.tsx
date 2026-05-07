'use client';

import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import Botao from '@/components/ui/Botao';
import CardUber from '@/components/ui/CardUber';
import CartaoTag from '@/components/ui/CartaoTag';
import ModalCadastroCompra from '@/components/ui/ModalCadastroCompra';
import ModalCadastroCorrida from '@/components/ui/ModalCadastroCorrida';
import ModalEditarCompra from '@/components/ui/ModalEditarCompra';
import SeletorMes from '@/components/ui/SeletorMes';
import { Cartao, Compra, Corrida, MesFechado, Usuario } from '@/types';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
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

    // Controle dos modais
    const [modalCompra, setModalCompra] = useState(false);
    const [modalCorrida, setModalCorrida] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
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

    const mesFechado = mesesFechados.some(
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
    const totalMes = totalCompras + totalUber;

    const dividaAnterior = useMemo(() => {
        const mes = mesesFechados.find(
            (mf) => mf.mes === mesSelecionado && mf.ano === anoSelecionado
        );
        return mes?.dividaAnterior ?? 0;
    }, [mesesFechados, mesSelecionado, anoSelecionado]);

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
                {/* Cabeçalho com nome e botão voltar */}
                <div className="flex items-start justify-between">
                    {/* Coluna esquerda: botão voltar + dados do usuário */}
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

                    {/* Coluna direita: botões de ação */}
                    <div className="flex gap-2">
                        {usuario?.usaUber && (
                            <Botao
                                cor="amarelo"
                                tamanho="sm"
                                icone={<MoreHorizontal className="w-4 h-4" />}
                                onClick={() => setModalCorrida(true)}
                            >
                                Corrida
                            </Botao>
                        )}
                        <Botao
                            cor="verde"
                            tamanho="sm"
                            onClick={() => setModalCompra(true)}
                        >
                            + Compra
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

                {/* Tabela de compras com botões editar/excluir */}
                {comprasDoMes.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        Nenhuma compra neste mês.
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
                        <table className="w-full text-sm min-w-[700px]">
                            <thead>
                                <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wide">
                                    <th className="px-3 py-3 text-left">
                                        Cartão
                                    </th>
                                    <th className="px-3 py-3 text-left">
                                        Descrição
                                    </th>
                                    <th className="px-3 py-3 text-center">
                                        Início
                                    </th>
                                    <th className="px-3 py-3 text-center">
                                        Parcelas
                                    </th>
                                    <th className="px-3 py-3 text-center">
                                        Término
                                    </th>
                                    <th className="px-3 py-3 text-right">
                                        Valor
                                    </th>
                                    <th className="px-3 py-3 text-center">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comprasDoMes.map((compra, index) => (
                                    <tr
                                        key={compra.id}
                                        className={
                                            index % 2 === 0
                                                ? 'bg-zinc-900'
                                                : 'bg-zinc-800'
                                        }
                                    >
                                        <td className="px-3 py-3">
                                            <CartaoTag
                                                cartao={compra.cartao as Cartao}
                                            />
                                        </td>
                                        <td className="px-3 py-3 text-zinc-200">
                                            {compra.descricao}
                                        </td>
                                        <td className="px-3 py-3 text-center text-zinc-400">
                                            {MESES[compra.mesInicio - 1]}/
                                            {compra.anoInicio}
                                        </td>
                                        <td className="px-3 py-3 text-center text-zinc-400">
                                            {anoSelecionado * 12 +
                                                mesSelecionado -
                                                (compra.anoInicio * 12 +
                                                    compra.mesInicio) +
                                                1}
                                            /{compra.qtdParcelas}
                                        </td>
                                        <td className="px-3 py-3 text-center text-zinc-400">
                                            {MESES[compra.mesFinal - 1]}/
                                            {compra.anoFinal}
                                        </td>
                                        <td className="px-3 py-3 text-right font-medium text-zinc-100">
                                            R${' '}
                                            {compra.valorParcela
                                                .toFixed(2)
                                                .replace('.', ',')}
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex gap-1 justify-center">
                                                <Botao
                                                    cor="amarelo"
                                                    tamanho="sm"
                                                    onClick={() => {
                                                        setCompraEditando(
                                                            compra
                                                        );
                                                        setModalEditar(true);
                                                    }}
                                                >
                                                    Editar
                                                </Botao>
                                                <Botao
                                                    cor="vermelho"
                                                    tamanho="sm"
                                                    onClick={() =>
                                                        handleExcluirCompra(
                                                            compra.id
                                                        )
                                                    }
                                                >
                                                    Excluir
                                                </Botao>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Rodapé com totais */}
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                    <Badge status={mesFechado ? 'finalizado' : 'aberto'} />

                    {dividaAnterior > 0 && (
                        <div className="text-center">
                            <p className="text-xs text-zinc-500">
                                Dívida anterior
                            </p>
                            <p className="text-sm font-medium text-red-400">
                                R$ {dividaAnterior.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                    )}

                    <div className="text-right">
                        <p className="text-xs text-zinc-500">Total do mês</p>
                        <p className="text-base font-bold text-zinc-100">
                            R$ {totalMes.toFixed(2).replace('.', ',')}
                        </p>
                    </div>
                </div>
            </main>

            {/* Modais */}
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
                    // Rebusca corridas após cadastrar
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
        </div>
    );
}
