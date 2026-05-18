import Footer from '@/components/layout/Footer';
import Providers from '@/components/layout/Providers';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-inter',
});

export const viewport: Viewport = {
    themeColor: '#09090b',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: 'Controle de Gastos',
    description: 'Sistema de controle de gastos com cartões',
    icons: {
        icon: '/favicon.ico',
        apple: '/icon-192.png',
        shortcut: '/favicon.ico',
    },
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Gastos',
        startupImage: '/icon-512.png',
    },
    applicationName: 'Controle de Gastos',
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={inter.variable}>
            <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
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