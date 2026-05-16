// src/config/cartoes.ts
// Centraliza configurações dos cartões de crédito

import { Cartao } from '@/types';

export const CORES_CARTAO: Record<Cartao, string> = {
    NUBANK: '#820AD1',
    INTER: '#FF6600',
    HIPER: '#CC0000',
    ITAU: '#003087',
};

export const NOMES_CARTAO: Record<Cartao, string> = {
    NUBANK: 'Nubank',
    INTER: 'Inter',
    HIPER: 'Hiper',
    ITAU: 'Itaú',
};

// Cores para Tailwind (usado em classes dinâmicas)
export const CORES_TAILWIND: Record<Cartao, string> = {
    NUBANK: 'bg-[#820AD1]',
    INTER: 'bg-[#FF6600]',
    HIPER: 'bg-[#CC0000]',
    ITAU: 'bg-[#003087]',
};

export const LISTA_CARTOES: Cartao[] = ['NUBANK', 'INTER', 'HIPER', 'ITAU'];
