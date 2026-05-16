# 📁 Estrutura de Pastas — Controle de Gastos

> Documentação da estrutura atual do projeto + proposta de reorganização  
> Tecnologia: Next.js 16 (App Router) + React 19 + TypeScript + Prisma + PostgreSQL

---

## 🗂️ Estrutura Atual

```
controle-gastos/
├── .env.local                    # Variáveis de ambiente (não versionar!)
├── .gitignore
├── next.config.ts                # Configuração Next.js (React Compiler habilitado)
├── tsconfig.json                 # TypeScript strict mode, paths @/*
├── tailwind.config.ts            # Cores customizadas dos cartões
├── postcss.config.mjs
├── package.json
├── prisma/
│   ├── schema.prisma             # Modelos: Usuario, Compra, MesFechado, Corrida
│   ├── seed.ts                   # Dados iniciais
│   └── migrations/               # Migrações do Prisma
├── src/
│   ├── app/
│   │   ├── (auth)/               # Route Group: rotas públicas de autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Tela de login
│   │   │   ├── trocar-senha/
│   │   │   │   └── page.tsx      # Troca de senha no primeiro acesso
│   │   │   └── layout.tsx        # Layout centralizado (sem sidebar)
│   │   ├── (sistema)/            # Route Group: rotas protegidas
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx      # Dashboard do administrador
│   │   │   │   ├── PaginaAdminCliente.tsx
│   │   │   │   └── comprador/
│   │   │   │       └── [id]/
│   │   │   │           ├── page.tsx              # Detalhes do comprador (admin)
│   │   │   │           └── PaginaCompradorAdminCliente.tsx
│   │   │   ├── comprador/
│   │   │   │   ├── page.tsx      # Dashboard do comprador
│   │   │   │   └── PaginaCompradorCliente.tsx
│   │   │   └── layout.tsx        # Layout protegido (verifica sessão JWT)
│   │   ├── api/                  # API Routes (Next.js App Router)
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts  # Endpoints do NextAuth
│   │   │   │   └── alterar-senha/
│   │   │   │       └── route.ts  # POST/PATCH troca de senha
│   │   │   ├── compras/
│   │   │   │   ├── route.ts      # POST nova compra
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts  # PUT/DELETE compra
│   │   │   │   └── usuario/
│   │   │   │       └── route.ts  # GET compras do usuário logado
│   │   │   ├── corridas/
│   │   │   │   ├── route.ts      # POST nova corrida
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts  # DELETE corrida
│   │   │   │   └── usuario/
│   │   │   │       └── route.ts  # GET corridas do mês
│   │   │   ├── meses/
│   │   │   │   └── route.ts      # GET/POST meses fechados
│   │   │   └── usuarios/
│   │   │       ├── route.ts      # GET lista / POST novo usuário
│   │   │       └── [id]/
│   │   │           └── route.ts  # GET/PUT/DELETE usuário
│   │   ├── globals.css           # Estilos globais + Tailwind
│   │   ├── layout.tsx            # Root layout (html, body, Providers)
│   │   └── page.tsx              # Redireciona / → /login
│   ├── components/
│   │   ├── auth/
│   │   │   └── LogoutAoFecharNavegador.tsx
│   │   ├── base/
│   │   │   └── TabelaBase.tsx    # Tabela genérica reutilizável
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Providers.tsx     # SessionProvider + logout automático
│   │   └── ui/                   # Componentes de UI específicos
│   │       ├── Badge.tsx
│   │       ├── Botao.tsx
│   │       ├── CardDividaAnterior.tsx
│   │       ├── CardUber.tsx
│   │       ├── CartaoTag.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── ModalCadastroCompra.tsx
│   │       ├── ModalCadastroComprador.tsx
│   │       ├── ModalCadastroCorrida.tsx
│   │       ├── ModalEditarCompra.tsx
│   │       ├── ModalEditarComprador.tsx
│   │       ├── ModalPagamento.tsx
│   │       ├── SeletorMes.tsx
│   │       ├── TabelaCompras.tsx
│   │       └── Toggle.tsx
│   ├── generated/prisma/         # Prisma Client gerado (não editar manualmente)
│   ├── lib/
│   │   ├── api-auth.ts           # Funções de autorização (exigirAdmin, exigirUsuarioAutenticado)
│   │   ├── auth.ts               # Configuração NextAuth (CredentialsProvider + JWT)
│   │   ├── browser-session.ts    # Chave do sessionStorage
│   │   ├── prisma.ts             # Instância singleton do Prisma Client
│   │   └── utils.ts              # Utilitários (gerar login, calcular parcelas)
│   ├── repositories/             # Camada de acesso a dados (Repository Pattern)
│   │   ├── compra.repository.ts
│   │   ├── corrida.repository.ts
│   │   ├── mes.repository.ts
│   │   └── usuario.repository.ts
│   ├── schemas/                  # Validação Zod
│   │   ├── compra.schema.ts
│   │   └── usuario.schema.ts
│   ├── services/                 # Regras de negócio (Service Layer)
│   │   ├── compra.service.ts
│   │   ├── corrida.service.ts
│   │   ├── mes.service.ts
│   │   └── usuario.service.ts
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript compartilhados
│   └── proxy.ts                  # Placeholder/arquivo vazio
```

---

## 🎯 Proposta de Reorganização (Pós-Refatoração)

Após aplicar as correções recomendadas, a estrutura ideal seria:

```
src/
├── app/
│   ├── (auth)/
│   ├── (sistema)/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── base/                    # Componentes 100% genéricos
│   ├── layout/
│   └── ui/                      # Componentes de domínio
├── config/
│   └── cartoes.ts               # CORES_CARTAO centralizado
├── generated/prisma/
├── hooks/                       # Hooks customizados
│   ├── useResumoMensalComprador.ts
│   └── useCadastroCompra.ts
├── lib/
│   ├── api/                     # Camada de API client
│   │   ├── client.ts            # Wrapper genérico (get/post/put/del)
│   │   ├── compras.ts
│   │   ├── usuarios.ts
│   │   ├── meses.ts
│   │   └── corridas.ts
│   ├── auth.ts
│   ├── browser-session.ts
│   ├── financeiro.ts            # Cálculos financeiros centralizados
│   ├── month.ts                 # Helpers de mês/parcela
│   ├── prisma.ts
│   └── utils.ts
├── repositories/
├── schemas/
├── services/
├── types/
└── __tests__/                   # Testes unitários
    ├── lib/
    │   ├── month.test.ts
    │   └── financeiro.test.ts
    ├── schemas/
    │   └── compra.schema.test.ts
    └── services/
        └── mes.service.test.ts
```

---

## 📐 Convenções de Nomenclatura

| Tipo | Padrão | Exemplo |
|---|---|---|
| Páginas | `page.tsx` dentro da pasta da rota | `app/(sistema)/admin/page.tsx` |
| Componentes client-side | `NomeCliente.tsx` | `PaginaAdminCliente.tsx` |
| APIs | `route.ts` | `app/api/compras/route.ts` |
| Services | `nome.service.ts` | `compra.service.ts` |
| Repositories | `nome.repository.ts` | `compra.repository.ts` |
| Schemas | `nome.schema.ts` | `compra.schema.ts` |
| Hooks | `useNome.ts` | `useResumoMensalComprador.ts` |
| Utils | `nome.ts` | `financeiro.ts`, `month.ts` |

---

## 🚫 O que NÃO versionar

```
.env.local
.env.production
.env*
*.log
node_modules/
src/generated/prisma/   # (opcional: gerar no CI)
```

---

*Documento gerado em 2026-05-15.*
