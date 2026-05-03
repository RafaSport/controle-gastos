import {
    CreditCard,
    LayoutDashboard,
    LogOut,
    Users,
    Wallet,
} from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="hidden md:flex w-64 h-screen bg-white border-r flex-col p-4">
            {/* Logo */}
            <h2 className="text-xl font-bold text-gray-700 mb-8">Controle</h2>

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

            {/* Rodapé */}
            <div className="mt-auto">
                <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 w-full">
                    <LogOut size={20} />
                    Sair
                </button>
            </div>
        </aside>
    );
}
