import { z } from 'zod'

// Schema para cadastro de novo comprador
export const schemaCadastroUsuario = z.object({
  nome:     z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  sobrenome: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  usaUber:  z.boolean().default(false), // indica se o comprador usa uber
})

// Schema para alteração de senha no primeiro login
export const schemaAlterarSenha = z.object({
  novaSenha: z.string().min(5, 'A senha deve ter pelo menos 5 caracteres'),
})