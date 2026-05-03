'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useEffect, useState } from 'react';

type Comprador = {
    id: number;
    nome: string;
    parcelas: number;
    valor: number;
};

export default function CompradoresPage() {
    const [compradores, setCompradores] = useState<Comprador[]>([]);

    const [modalAberto, setModalAberto] = useState(false);
    const [nome, setNome] = useState('');

    const [editandoId, setEditandoId] = useState<number | null>(null);

    useEffect(() => {
        const dados = localStorage.getItem('compradores');

        if (dados) {
            setCompradores(JSON.parse(dados));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('compradores', JSON.stringify(compradores));
    }, [compradores]);

    function gerarLogin(nomeCompleto: string) {
        return nomeCompleto.toLowerCase().trim().replaceAll(' ', '.');
    }

    function salvarComprador() {
        if (!nome.trim()) return;

        if (editandoId) {
            const listaAtualizada = compradores.map((item) =>
                item.id === editandoId ? { ...item, nome } : item
            );

            setCompradores(listaAtualizada);
        } else {
            const novo = {
                id: Date.now(),
                nome,
                parcelas: 0,
                valor: 0,
            };

            setCompradores([...compradores, novo]);
        }

        setNome('');
        setEditandoId(null);
        setModalAberto(false);
    }

    function editarComprador(id: number) {
        const comprador = compradores.find((item) => item.id === id);

        if (!comprador) return;

        setNome(comprador.nome);
        setEditandoId(id);
        setModalAberto(true);
    }

    function excluirComprador(id: number) {
        const confirmar = confirm('Deseja excluir este comprador?');

        if (!confirmar) return;

        const novaLista = compradores.filter((item) => item.id !== id);

        setCompradores(novaLista);
    }

    const loginGerado = gerarLogin(nome);
    const senhaGerada = `${loginGerado}12345`;

    return (
        <MainLayout>
            <div className="space-y-4">
                {/* Topo */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Compradores
                    </h1>

                    <button
                        onClick={() => {
                            setEditandoId(null);
                            setNome('');
                            setModalAberto(true);
                        }}
                        className="bg-gray-800 text-white px-4 h-10 rounded-xl"
                    >
                        Novo
                    </button>
                </div>

                {/* Lista */}
                <div className="space-y-3">
                    {compradores.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-sm p-4"
                        >
                            <h2 className="font-semibold text-lg">
                                {item.nome}
                            </h2>

                            <p className="text-sm text-gray-500">
                                Parcelas ativas: {item.parcelas}
                            </p>

                            <p className="text-sm text-gray-500">
                                Total mês: R$ {item.valor}
                            </p>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => editarComprador(item.id)}
                                    className="px-3 h-9 rounded-xl border text-sm"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => excluirComprador(item.id)}
                                    className="px-3 h-9 rounded-xl bg-red-500 text-white text-sm"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {modalAberto && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                        <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editandoId
                                    ? 'Editar Comprador'
                                    : 'Novo Comprador'}
                            </h2>

                            {/* Nome */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Nome completo
                                </label>

                                <input
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="w-full h-12 px-4 mt-1 border rounded-xl"
                                />
                            </div>

                            {/* Login */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Login
                                </label>

                                <input
                                    value={loginGerado}
                                    disabled
                                    className="w-full h-12 px-4 mt-1 border rounded-xl bg-gray-100"
                                />
                            </div>

                            {/* Senha */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Senha inicial
                                </label>

                                <input
                                    value={senhaGerada}
                                    disabled
                                    className="w-full h-12 px-4 mt-1 border rounded-xl bg-gray-100"
                                />
                            </div>

                            {/* Botões */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setModalAberto(false);
                                        setEditandoId(null);
                                        setNome('');
                                    }}
                                    className="h-12 rounded-xl border"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={salvarComprador}
                                    className="h-12 rounded-xl bg-gray-800 text-white"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
