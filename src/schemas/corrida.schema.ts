import { z } from 'zod';

const ANO_MINIMO = 2024;
const ANO_MAXIMO = 2100;

// ============================================
// SCHEMA: Cadastro de corrida Uber
// ============================================

export const schemaCadastroCorrida = z.object({
    usuarioId: z.string().uuid('ID do usuário inválido'),
    data: z.string().datetime('Data inválida'),
    mesReferencia: z.number().int().min(1).max(12),
    anoReferencia: z.number().int().min(ANO_MINIMO).max(ANO_MAXIMO),
    valor: z.number().positive('Valor deve ser maior que zero').max(9999.99, 'Valor muito alto'),
});

// ============================================
// SCHEMA: Busca de corridas
// ============================================

export const schemaBuscaCorridas = z.object({
    usuarioId: z.string().uuid('ID do usuário inválido'),
    mes: z.coerce.number().int().min(1).max(12).optional(),
    ano: z.coerce.number().int().min(ANO_MINIMO).max(ANO_MAXIMO).optional(),
});

// ============================================
// TIPOS INFERIDOS
// ============================================

export type CadastroCorridaInput = z.infer<typeof schemaCadastroCorrida>;
export type BuscaCorridasInput = z.infer<typeof schemaBuscaCorridas>;