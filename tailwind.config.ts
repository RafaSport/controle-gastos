import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Fonte Inter disponível como utility class
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },

            // Cores dos cartões acessíveis como classes Tailwind
            colors: {
                nubank: '#820AD1',
                inter: '#FF6600',
                hiper: '#CC0000',
                itau: '#003087',
                aberto: '#22c55e',
                fechado: '#71717a',
            },

            // Animação suave para modais e transições
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.15s ease-out',
            },
        },
    },
    plugins: [],
};

export default config;
