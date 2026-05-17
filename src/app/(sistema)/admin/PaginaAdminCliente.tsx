'use client';

import TabelaBase, { Coluna } from '@/components/base/TabelaBase';
import Header from '@/components/layout/Header';
import Botao from '@/components/ui/Botao';
import ModalCadastroComprador from '@/components/ui/ModalCadastroComprador';
import ModalConfirmacao from '@/components/ui/ModalConfirmacao';
import ModalEditarComprador from '@/components/ui/ModalEditarComprador';
import { apiDelete, apiGet } from '@/lib/api-client';
import { Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Comprador {
    id: string;
    nome: string;
    sobrenome: string;
    login: string;
    usaUber: boolean;
    qtdCompras: number;
    totalAPagar: number;
}

export default function PaginaAdminCliente() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // TODOS OS HOOKS DEVEM FICAR ANTES DOS RETURNS
    const [compradores, setCompradores] = useState<Comprador[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [modalCadastro, setModalCadastro] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [compradorEditando, setCompradorEditando] =
        useState<Comprador | null>(null);

    // Estados do modal de confirmação para exclusão de comprador
    const [modalExcluir, setModalExcluir] = useState(false);
    const [compradorExcluindo, setCompradorExcluindo] =
        useState<Comprador | null>(null);
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    async function buscarCompradores() {
        setCarregando(true);

        try {
            // ANTES: fetch manual + Array.isArray check
            // const res = await fetch('/api/usuarios');
            // const data = await res.json();
            // setCompradores(Array.isArray(data) ? data : []);

            // DEPOIS: apiGet tipado — erro HTTP e parsing tratados automaticamente
            const data = await apiGet<Comprador[]>('/api/usuarios');
            setCompradores(data);
        } catch (erro) {
            console.error('Erro ao buscar compradores:', erro);
            setCompradores([]);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        if (session) {
            buscarCompradores();
        }
    }, [session]);

    if (status === 'loading') {
        return (
            <div className="text-center py-12 text-zinc-500">
                Carregando sessão...
            </div>
        );
    }

    if (!session) {
        return null;
    }

    /** Abre modal de confirmação para excluir comprador */
    function handleExcluir(comprador: Comprador) {
        setCompradorExcluindo(comprador);
        setModalExcluir(true);
    }

    /** Executa exclusão após confirmação no modal */
    async function confirmarExcluir() {
        if (!compradorExcluindo) return;

        setExcluindo(true);

        try {
            await apiDelete(`/api/usuarios/${compradorExcluindo.id}`);
            buscarCompradores();
        } catch (erro) {
            console.error('Erro ao excluir comprador:', erro);
        } finally {
            setExcluindo(false);
            setModalExcluir(false);
            setCompradorExcluindo(null);
        }
    }

    function handleEditar(e: React.MouseEvent, comprador: Comprador) {
        e.stopPropagation();
        setCompradorEditando(comprador);
        setModalEditar(true);
    }

    const colunas: Coluna<Comprador>[] = [
        {
            header: 'Nome',
            render: (c) => (
                <div>
                    <p className="font-medium text-zinc-100">
                        {c.nome} {c.sobrenome}
                    </p>
                    <p className="text-xs text-zinc-500">{c.login}</p>
                </div>
            ),
        },
        {
            header: 'Compras',
            align: 'center',
            render: (c) => (
                <span className="text-zinc-400">{c.qtdCompras}</span>
            ),
        },
        {
            header: 'Uber',
            align: 'center',
            render: (c) =>
                c.usaUber ? (
                    <span className="text-xs font-medium text-blue-400">
                        Sim
                    </span>
                ) : (
                    <span className="text-xs text-zinc-600">—</span>
                ),
        },
        {
            header: 'Total a pagar',
            align: 'right',
            render: (c) => (
                <span className="font-medium text-zinc-100">
                    R$ {c.totalAPagar.toFixed(2).replace('.', ',')}
                </span>
            ),
        },
    ];

    return (
        <div className="flex-1 bg-zinc-950">
            <Header nomeUsuario={session.user?.name ?? 'Admin'} />

            <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-zinc-100">
                        Compradores
                    </h1>

                    <Botao
                        cor="verde"
                        tamanho="sm"
                        onClick={() => setModalCadastro(true)}
                    >
                        + Novo Comprador
                    </Botao>
                </div>

                {carregando ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        Carregando...
                    </div>
                ) : (
                    <TabelaBase
                        dados={compradores}
                        colunas={colunas}
                        keyExtractor={(c) => c.id}
                        emptyMessage="Nenhum comprador cadastrado."
                        onRowClick={(c) =>
                            router.push(`/admin/comprador/${c.id}`)
                        }
                        acoes={(c) => (
                            <>
                                <Botao
                                    cor="amarelo"
                                    tamanho="sm"
                                    onClick={(e) => handleEditar(e, c)}
                                >
                                    Editar
                                </Botao>

                                <Botao
                                    cor="vermelho"
                                    tamanho="sm"
                                    icone={<Trash2 size={14} />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleExcluir(c);
                                    }}
                                />
                            </>
                        )}
                    />
                )}
            </main>

            <ModalCadastroComprador
                aberto={modalCadastro}
                onFechar={() => setModalCadastro(false)}
                onSalvar={buscarCompradores}
            />

            <ModalEditarComprador
                aberto={modalEditar}
                comprador={compradorEditando}
                onFechar={() => {
                    setModalEditar(false);
                    setCompradorEditando(null);
                }}
                onSalvar={buscarCompradores}
            />

            {/* Modal de confirmação para exclusão de comprador */}
            <ModalConfirmacao
                aberto={modalExcluir}
                titulo="Excluir Comprador"
                mensagem={
                    compradorExcluindo
                        ? `Deseja excluir "${compradorExcluindo.nome} ${compradorExcluindo.sobrenome}" (${compradorExcluindo.login})? Todas as compras, corridas e fechamentos serão removidos permanentemente.`
                        : 'Deseja excluir este comprador?'
                }
                textoConfirmar="Excluir"
                textoCancelar="Cancelar"
                corConfirmar="vermelho"
                carregando={excluindo}
                onConfirmar={confirmarExcluir}
                onCancelar={() => {
                    setModalExcluir(false);
                    setCompradorExcluindo(null);
                }}
            />
        </div>
    );
}