'use client';

import { CHAVE_SESSAO_NAVEGADOR } from '@/lib/browser-session';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutAoFecharNavegador() {
    const { status } = useSession();

    useEffect(() => {
        if (status !== 'authenticated') {
            return;
        }

        const sessaoDoNavegadorAtiva = sessionStorage.getItem(
            CHAVE_SESSAO_NAVEGADOR
        );

        // Se existe sessão do Auth.js, mas o sessionStorage foi apagado,
        // significa que o usuário provavelmente fechou a aba/janela e abriu o sistema novamente.
        if (!sessaoDoNavegadorAtiva) {
            void signOut({ callbackUrl: '/login' });
        }
    }, [status]);

    return null;
}
