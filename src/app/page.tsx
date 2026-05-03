import { MainLayout } from '@/components/layout/MainLayout';

export default function Home() {
    return (
        <MainLayout>
            <div className="space-y-4">
                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>

                {/* Cards exemplo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <p className="text-sm text-gray-500">Total a Receber</p>
                        <h3 className="text-2xl font-bold mt-2">R$ 2.450,00</h3>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <p className="text-sm text-gray-500">Compradores</p>
                        <h3 className="text-2xl font-bold mt-2">8</h3>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <p className="text-sm text-gray-500">Pendentes</p>
                        <h3 className="text-2xl font-bold mt-2">3</h3>
                    </div>
                </div>

                {/* Área futura tabela */}
                <div className="bg-white p-4 rounded-2xl shadow-sm min-h-[300px]">
                    Área da tabela principal
                </div>
            </div>
        </MainLayout>
    );
}
