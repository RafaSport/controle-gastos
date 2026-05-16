# 💰 Controle de Gastos

> Sistema web para controle de compras parceladas, corridas Uber e fechamento mensal com dívida rolante.  
> Desenvolvido com **Next.js 16**, **React 19**, **TypeScript**, **Prisma** e **PostgreSQL**.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Funcionalidades

### 👑 Administrador

- 📋 **Gerenciar Compradores** — cadastrar, editar, resetar senha e excluir
- 💳 **Gerenciar Compras** — cadastrar compras parceladas com cálculo automático de mês final
- 🚗 **Gerenciar Corridas Uber** — registrar corridas para compradores habilitados
- 📅 **Fechamento de Mês** — registrar pagamento (total/parcial) com cálculo automático de dívida rolante
- 📊 **Resumo Financeiro** — visualizar total de compras, Uber, dívida anterior e consolidado por mês

### 🛒 Comprador

- 👁️ **Visualizar Próprias Compras** — lista filtrada por mês/ano com parcelas ativas
- 💵 **Acompanhar Gastos** — total de compras, corridas Uber e dívida anterior
- 🔒 **Alterar Senha** — troca obrigatória no primeiro acesso

---

## 🏗️ Arquitetura

O projeto segue uma **arquitetura em camadas** (Layered Architecture):

```
┌─────────────────────────────────────────────────────────┐
│                    Componentes React                    │
│         (Pages, Modals, UI — Client/Server)             │
└─────────────────────┬───────────────────────────────────┘
                      │ fetch() / API calls
┌─────────────────────▼───────────────────────────────────┐
│                     API Routes (Next.js)                │
│  /api/compras, /api/usuarios, /api/meses, /api/corridas │
└─────────────────────┬───────────────────────────────────┘
                      │ autorização (api-auth.ts)
┌─────────────────────▼───────────────────────────────────┐
│                   Services (Regras de Negócio)          │
│  compra.service.ts, mes.service.ts, usuario.service.ts  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                Repositories (Acesso a Dados)            │
│  compra.repository.ts, usuario.repository.ts, etc.      │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Prisma ORM + PostgreSQL                │
└─────────────────────────────────────────────────────────┘
```

### Padrões utilizados

- **Repository Pattern** — abstração do acesso a dados
- **Service Layer** — isolamento das regras de negócio
- **Schema Validation (Zod)** — validação de entrada nas APIs
- **JWT + RBAC** — autenticação stateless com controle de papéis
- **Server-Side Rendering (SSR)** — páginas protegidas renderizadas no servidor

---

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/) (ou conta [Neon](https://neon.tech))
- Conta na [Google AI Studio](https://aistudio.google.com) (para API Key do Gemini — usada pelo Cline)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/controle-gastos.git
cd controle-gastos
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@host:5432/controle_gastos?schema=public"

# NextAuth / Auth.js
AUTH_SECRET="sua-chave-secreta-aleatoria-minimo-32-caracteres"
AUTH_URL="http://localhost:3000"

# Opcional: para desenvolvimento com Cline + Gemini
# (não é necessária para rodar o sistema, apenas para o agente de IA)
```

> ⚠️ **NUNCA** commite o arquivo `.env.local`. Ele já está no `.gitignore`.

### 4. Execute as migrações do Prisma

```bash
npx prisma migrate dev
```

### 5. (Opcional) Popule o banco com dados iniciais

```bash
npx prisma db seed
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🗂️ Estrutura de Pastas

```
src/
├── app/                    # Rotas do Next.js App Router
│   ├── (auth)/             # Grupo de rotas públicas (login, trocar-senha)
│   ├── (sistema)/          # Grupo de rotas protegidas (admin, comprador)
│   └── api/                # API Routes
├── components/             # Componentes React
│   ├── base/               # Componentes genéricos (TabelaBase, Botao, Input)
│   ├── layout/             # Header, Footer, Providers
│   └── ui/                 # Componentes de domínio (modais, cards, tabelas)
├── lib/                      # Utilitários, auth, prisma, helpers
├── repositories/             # Camada de acesso a dados (Prisma)
├── schemas/                  # Validação Zod
├── services/                 # Regras de negócio
└── types/                    # Tipos TypeScript
```

Para a estrutura completa, veja [`ESTRUTURA_DE_PASTAS.md`](./ESTRUTURA_DE_PASTAS.md).

---

## 👥 Papéis e Permissões

| Funcionalidade                   | ADMIN | COMPRADOR |
| -------------------------------- | ----- | --------- |
| Gerenciar compradores            | ✅    | ❌        |
| Cadastrar/editar/excluir compras | ✅    | ❌        |
| Cadastrar corridas Uber          | ✅    | ❌        |
| Fechar mês / registrar pagamento | ✅    | ❌        |
| Visualizar próprias compras      | ✅    | ✅        |
| Visualizar próprio resumo mensal | ✅    | ✅        |
| Alterar própria senha            | ✅    | ✅        |

---

## 🗺️ Navegação

| Rota                    | Descrição                         | Acesso                        |
| ----------------------- | --------------------------------- | ----------------------------- |
| `/login`                | Tela de login                     | Público                       |
| `/trocar-senha`         | Troca de senha no primeiro acesso | Autenticado + primeiro acesso |
| `/admin`                | Dashboard do administrador        | ADMIN                         |
| `/admin/comprador/[id]` | Detalhes do comprador (admin)     | ADMIN                         |
| `/comprador`            | Dashboard do comprador            | COMPRADOR                     |

Para o mapa completo de fluxos, veja [`NAVEGACAO_DE_TELAS.md`](./NAVEGACAO_DE_TELAS.md).

---

## 📋 Requisitos

Para a especificação completa de requisitos funcionais e não-funcionais, veja [`REQUISITOS.md`](./REQUISITOS.md).

---

## 🛠️ Tecnologias

- [Next.js 16](https://nextjs.org/) — Framework React com App Router
- [React 19](https://react.dev/) — Biblioteca UI
- [TypeScript 5](https://www.typescriptlang.org/) — Tipagem estática
- [Prisma 7](https://prisma.io/) — ORM para PostgreSQL
- [NextAuth.js v5](https://authjs.dev/) — Autenticação JWT
- [Tailwind CSS 4](https://tailwindcss.com/) — Estilização utilitária
- [Zod](https://zod.dev/) — Validação de schemas
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Hash de senhas
- [Lucide React](https://lucide.dev/) — Ícones

---

## 🧪 Testes

> Em desenvolvimento. Testes unitários para helpers financeiros e services serão adicionados em breve.

```bash
# Rodar testes (quando configurados)
npm test
```

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para sugerir melhorias ou reportar bugs, abra uma **issue** ou envie um **pull request**.

---

> Desenvolvido com ❤️ para controle financeiro pessoal e familiar.
