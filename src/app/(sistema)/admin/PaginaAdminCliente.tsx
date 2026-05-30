'use client';

import TabelaBase, { Coluna } from '@/components/base/TabelaBase';
import Header from '@/components/layout/Header';
import Botao from '@/components/ui/Botao';
import ModalCadastroComprador from '@/components/ui/ModalCadastroComprador';
import { apiGet } from '@/lib/api-client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

interface Comprador {
    id: string;
    nome: string;
    sobrenome: string;
    login: string;
    usaUber: boolean;
    mesEmAberto: number;
    anoEmAberto: number;
    totalAPagar: number;
}

export default function PaginaAdminCliente() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [compradores, setCompradores] = useState<Comprador[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [modalCadastro, setModalCadastro] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    async function buscarCompradores() {
        setCarregando(true);

        try {
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
            header: 'Mês Aberto',
            align: 'center',
            render: (c) => (
                <span className="text-zinc-400 text-xs sm:text-sm">
                    {MESES[c.mesEmAberto - 1]}/{c.anoEmAberto}
                </span>
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
                    />
                )}
            </main>

            <ModalCadastroComprador
                aberto={modalCadastro}
                onFechar={() => setModalCadastro(false)}
                onSalvar={buscarCompradores}
            />
        </div>
    );
}