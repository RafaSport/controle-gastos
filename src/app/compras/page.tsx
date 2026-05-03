'use client';

import { MainLayout } from '@/components/layout/MainLayout';

export default function ComprasPage() {
    return (
        <MainLayout>
            <div className="space-y-4">
                {/* Topo */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Compras
                        </h1>

                        <p className="text-sm text-gray-500">
                            Gerencie compras parceladas
                        </p>
                    </div>

                    <button className="bg-gray-800 text-white px-4 h-10 rounded-xl">
                        Nova Compra
                    </button>
                </div>

                {/* Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Compras Ativas</p>

                        <h2 className="text-2xl font-bold mt-1">0</h2>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Parcelas do Mês</p>

                        <h2 className="text-2xl font-bold mt-1">R$ 0,00</h2>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Compradores</p>

                        <h2 className="text-2xl font-bold mt-1">0</h2>
                    </div>
                </div>

                {/* Área lista */}
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-500">
                    Nenhuma compra cadastrada.
                </div>
            </div>
        </MainLayout>
    );
}
