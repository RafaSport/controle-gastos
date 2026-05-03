'use client';

import {
    CreditCard,
    LayoutDashboard,
    LogOut,
    Users,
    Wallet,
} from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
    function sair() {
        localStorage.removeItem('logado');
        window.location.href = '/login';
    }

    return (
        <aside className="hidden md:flex w-64 h-screen bg-white border-r flex-col p-4">
            <h2 className="text-xl font-bold text-gray-700 mb-8">Controle</h2>

            <nav className="flex flex-col gap-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link
                    href="/compradores"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
                >
                    <Users size={20} />
                    Compradores
                </Link>

                <Link
                    href="/compras"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
                >
                    <CreditCard size={20} />
                    Compras
                </Link>

                <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
                    <Wallet size={20} />
                    Pagamentos
                </button>
            </nav>

            <div className="mt-auto">
                <button
                    onClick={sair}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 w-full"
                >
                    <LogOut size={20} />
                    Sair
                </button>
            </div>
        </aside>
    );
}
