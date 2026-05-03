'use client';

import {
    CreditCard,
    LayoutDashboard,
    LogOut,
    Users,
    Wallet,
    X,
} from 'lucide-react';

function sair() {
    localStorage.removeItem('logado');
    window.location.href = '/login';
}

type MobileMenuProps = {
    aberto: boolean;
    fechar: () => void;
};

export function MobileMenu({ aberto, fechar }: MobileMenuProps) {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
            {/* Painel lateral */}
            <aside className="w-72 h-full bg-white p-4 shadow-xl">
                {/* Topo */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-700">
                        Controle
                    </h2>

                    <button
                        onClick={fechar}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>

                    <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
                        <Users size={20} />
                        Compradores
                    </button>

                    <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
                        <CreditCard size={20} />
                        Compras
                    </button>

                    <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
                        <Wallet size={20} />
                        Pagamentos
                    </button>
                </nav>

                {/* Sair */}
                <div className="mt-10">
                    <button
                        onClick={sair}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 w-full"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>
        </div>
    );
}
