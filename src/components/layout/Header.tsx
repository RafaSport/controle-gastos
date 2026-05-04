'use client';

import Botao from '@/components/ui/Botao';
import { signOut } from 'next-auth/react';

interface HeaderProps {
    nomeUsuario: string;
}

export default function Header({ nomeUsuario }: HeaderProps) {
    return (
        <header className="w-full bg-zinc-900 border-b border-zinc-800 px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                {/* Saudação com nome do usuário */}
                <p className="text-sm font-medium text-zinc-400">
                    Olá, <span className="text-blue-400">{nomeUsuario}</span>!
                </p>

                <p className="text-sm font-medium text-zinc-400">
                    Sistema de controle de gastos
                </p>

                {/* Botão de logout no canto direito */}
                <Botao
                    cor="vermelho"
                    tamanho="sm"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                >
                    Sair
                </Botao>
            </div>
        </header>
    );
}
