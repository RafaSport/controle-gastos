import Providers from '@/components/layout/Providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Controle de Gastos',
    description: 'Sistema de controle de gastos com cartões',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={inter.variable}>
            <body className="bg-zinc-950 text-zinc-100 font-sans antialiased">
                {/* Providers envolve tudo para a sessão estar disponível em qualquer página */}
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
