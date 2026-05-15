'use client';

import LogoutAoFecharNavegador from '@/components/auth/LogoutAoFecharNavegador';
import { SessionProvider } from 'next-auth/react';

// Envolve a aplicação com o contexto de sessão do Auth.js.
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LogoutAoFecharNavegador />
            {children}
        </SessionProvider>
    );
}
