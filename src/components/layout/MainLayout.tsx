'use client';

import { useState } from 'react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { Sidebar } from './Sidebar';

type MainLayoutProps = {
    children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar desktop */}
            <Sidebar />

            {/* Menu mobile */}
            <MobileMenu
                aberto={menuAberto}
                fechar={() => setMenuAberto(false)}
            />

            {/* Conteúdo */}
            <div className="flex-1 flex flex-col">
                {/* Topo */}
                <Header abrirMenu={() => setMenuAberto(true)} />

                {/* Página */}
                <main className="p-4 md:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
