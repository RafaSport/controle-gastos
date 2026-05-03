'use client';

import { Menu } from 'lucide-react';

type HeaderProps = {
    abrirMenu: () => void;
};

export function Header({ abrirMenu }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 shadow-sm">
            {/* Botão menu no celular */}
            <button
                onClick={abrirMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
                <Menu size={24} />
            </button>

            {/* Nome sistema */}
            <h1 className="text-lg font-semibold text-gray-700">
                Controle de Gastos
            </h1>

            {/* Espaço futuro avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-200" />
        </header>
    );
}
