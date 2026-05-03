'use client';

import { MainLayout } from '@/components/layout/MainLayout';

const compradores = [
    {
        id: 1,
        nome: 'João Silva',
        parcelas: 3,
        valor: 250,
    },
    {
        id: 2,
        nome: 'Maria Souza',
        parcelas: 5,
        valor: 420,
    },
];

export default function CompradoresPage() {
    return (
        <MainLayout>
            <div className="space-y-4">
                {/* Topo */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Compradores
                    </h1>

                    <button className="bg-gray-800 text-white px-4 h-10 rounded-xl">
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

                            <p className="text-sm text-gray-500 mt-1">
                                Parcelas ativas: {item.parcelas}
                            </p>

                            <p className="text-sm text-gray-500">
                                Total mês: R$ {item.valor}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
