import { MainLayout } from '@/components/layout/MainLayout';

export default function Home() {
    return (
        <MainLayout>
            <div className="space-y-4">
                {/* Título */}
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <p className="text-sm text-gray-500">Total a Receber</p>

                        <h2 className="text-2xl font-bold mt-2">R$ 2.450,00</h2>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <p className="text-sm text-gray-500">Compradores</p>

                        <h2 className="text-2xl font-bold mt-2">8 Pessoas</h2>
                    </div>
                </div>

                {/* Área principal */}
                <div className="bg-white p-4 rounded-2xl shadow-sm min-h-[300px]">
                    Lista de compradores aparecerá aqui
                </div>
            </div>
        </MainLayout>
    );
}
