import { z } from 'zod';

// ============================================
// SCHEMA: Cadastro/Edição de Usuário
// ============================================

export const schemaCadastroUsuario = z.object({
    nome: z
        .string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(50, 'Nome muito longo'),
    sobrenome: z
        .string()
        .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
        .max(50, 'Sobrenome muito longo'),
    login: z
        .string()
        .min(3, 'Login deve ter pelo menos 3 caracteres')
        .max(20, 'Login muito longo'),
    senha: z
        .string()
        .min(5, 'Senha deve ter pelo menos 5 caracteres')
        .max(100, 'Senha muito longa')
        .optional(),
    usaUber: z.boolean().default(false),
});

// ============================================
// SCHEMA: Troca de senha
// ============================================

export const schemaTrocaSenha = z.object({
    senhaAtual: z.string().min(1, 'Senha atual obrigatória'),
    novaSenha: z.string().min(5, 'Nova senha deve ter pelo menos 5 caracteres'),
});

// ============================================
// SCHEMA: Alteração de senha (admin reset / primeiro acesso)
// ============================================

export const schemaAlterarSenha = z.object({
    novaSenha: z.string().min(5, 'Nova senha deve ter pelo menos 5 caracteres'),
});

// ============================================
// SCHEMA: Parâmetros de busca
// ============================================

export const schemaBuscaUsuario = z.object({
    id: z.string().uuid('ID inválido').optional(),
});

// ============================================
// TIPOS INFERIDOS
// ============================================

export type CadastroUsuarioInput = z.infer<typeof schemaCadastroUsuario>;
export type TrocaSenhaInput = z.infer<typeof schemaTrocaSenha>;
export type BuscaUsuarioInput = z.infer<typeof schemaBuscaUsuario>;