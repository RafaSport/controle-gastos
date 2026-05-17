import { z } from 'zod';

// ============================================
// CONSTANTES
// ============================================

const cartoesValidos = ['NUBANK', 'INTER', 'HIPER', 'ITAU'] as const;
const ANO_MINIMO = 2024;
const ANO_MAXIMO = 2100;

// ============================================
// SCHEMA: Cadastro/Edição de Compra
// ============================================

export const schemaCadastroCompra = z.object({
    usuarioId: z.string().uuid('ID do usuário inválido'),
    cartao: z
        .enum(cartoesValidos)
        .refine((val) => cartoesValidos.includes(val), {
            message: 'Cartão inválido',
        }),
    descricao: z
        .string()
        .min(2, 'Descrição deve ter pelo menos 2 caracteres')
        .max(100, 'Descrição muito longa'),
    mesCompra: z
        .number()
        .int()
        .min(1, 'Mês deve ser entre 1 e 12')
        .max(12, 'Mês deve ser entre 1 e 12'),
    anoCompra: z
        .number()
        .int()
        .min(ANO_MINIMO, `Ano deve ser ${ANO_MINIMO} ou posterior`)
        .max(ANO_MAXIMO, `Ano deve ser até ${ANO_MAXIMO}`),
    mesInicio: z
        .number()
        .int()
        .min(1, 'Mês de início deve ser entre 1 e 12')
        .max(12, 'Mês de início deve ser entre 1 e 12'),
    anoInicio: z
        .number()
        .int()
        .min(ANO_MINIMO, `Ano deve ser ${ANO_MINIMO} ou posterior`)
        .max(ANO_MAXIMO, `Ano deve ser até ${ANO_MAXIMO}`),
    qtdParcelas: z
        .number()
        .int()
        .min(1, 'Quantidade mínima: 1 parcela')
        .max(48, 'Quantidade máxima: 48 parcelas'),
    valorParcela: z
        .number()
        .positive('Valor da parcela deve ser maior que zero')
        .max(999999.99, 'Valor muito alto'),
});

// ============================================
// SCHEMA: Parâmetros de busca (query params)
// ============================================

export const schemaBuscaCompras = z.object({
    usuarioId: z.string().uuid('ID do usuário inválido'),
    mes: z.coerce.number().int().min(1).max(12).optional(),
    ano: z.coerce.number().int().min(ANO_MINIMO).max(ANO_MAXIMO).optional(),
});

// ============================================
// TIPOS INFERIDOS
// ============================================

export type CadastroCompraInput = z.infer<typeof schemaCadastroCompra>;
export type BuscaComprasInput = z.infer<typeof schemaBuscaCompras>;
