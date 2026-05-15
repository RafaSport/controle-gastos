import Footer from '@/components/layout/Footer';
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
    description: 'Sistema de controle de gastos com cartoes',
    icons: {
        icon: '/icon.png',
        apple: '/icon.png',
        shortcut: '/icon.png',
    },
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={inter.variable}>
            <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
                {/* Mantem o conteudo ocupando o espaco disponivel e o footer no fim da tela. */}
                <Providers>
                    <div className="min-h-screen flex flex-col bg-zinc-950">
                        <div className="flex-1 flex flex-col">{children}</div>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
