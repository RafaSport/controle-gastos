'use client';

import Botao from '@/components/ui/Botao';
import { Home, SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="text-center flex flex-col items-center gap-6 max-w-md">
                {/* Ícone */}
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center">
                    <SearchX className="w-10 h-10 text-zinc-500" />
                </div>

                {/* Título */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold text-zinc-100">404</h1>
                    <p className="text-lg text-zinc-400">
                        Página não encontrada
                    </p>
                </div>

                {/* Descrição */}
                <p className="text-sm text-zinc-500">
                    A página que você tentou acessar não existe ou foi movida.
                    Verifique o endereço ou volte para o início.
                </p>

                {/* Ações */}
                <div className="flex gap-3">
                    <Botao
                        cor="verde"
                        icone={<Home className="w-4 h-4" />}
                        onClick={() => router.push('/')}
                    >
                        Voltar ao início
                    </Botao>
                </div>
            </div>
        </div>
    );
}
