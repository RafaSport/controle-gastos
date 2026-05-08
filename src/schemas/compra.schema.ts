import { z } from 'zod';

// Cartões aceitos pelo sistema
const cartoesValidos = ['NUBANK', 'INTER', 'HIPER', 'ITAU'] as const;

// Schema para cadastro e edição de compra
export const schemaCadastroCompra = z.object({
    usuarioId: z.string().min(1),
    cartao: z.enum(cartoesValidos),
    descricao: z.string().min(2, 'Descrição obrigatória'),
    mesCompra: z.number().int().min(1).max(12),
    anoCompra: z.number().int().min(2024),
    mesInicio: z.number().int().min(1).max(12),
    anoInicio: z.number().int().min(2024),
    qtdParcelas: z.number().int().min(1),
    valorParcela: z.number().positive('Valor deve ser maior que zero'),
});
