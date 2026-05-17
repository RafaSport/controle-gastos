import { z } from 'zod';

const ANO_MINIMO = 2024;
const ANO_MAXIMO = 2100;

// ============================================
// SCHEMA: Fechamento de mês
// ============================================

export const schemaFechamentoMes = z.object({
    usuarioId: z.string().uuid('ID do usuário inválido'),
    mes: z.number().int().min(1, 'Mês deve ser entre 1 e 12').max(12, 'Mês deve ser entre 1 e 12'),
    ano: z.number().int().min(ANO_MINIMO).max(ANO_MAXIMO),
    totalPago: z.number().min(0, 'Valor pago não pode ser negativo'),
});

// ============================================
// SCHEMA: Busca de meses fechados
// ============================================

export const schemaBuscaMeses = z.object({
    usuarioId: z.string().uuid('ID do usuário inválido'),
});

// ============================================
// TIPOS INFERIDOS
// ============================================

export type FechamentoMesInput = z.infer<typeof schemaFechamentoMes>;
export type BuscaMesesInput = z.infer<typeof schemaBuscaMeses>;