import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Carrega a fonte Inter do Google com os pesos que vamos usar
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
            {/* Fundo escuro global aplicado no body */}
            <body className="bg-zinc-950 text-zinc-100 font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
