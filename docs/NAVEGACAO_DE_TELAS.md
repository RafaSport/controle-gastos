# 🗺️ Navegação de Telas — Controle de Gastos

> Mapa completo de fluxos, telas, permissões e transições do sistema.

---

## 🎨 Legenda

| Ícone | Significado |
|---|---|
| 🔓 | Tela pública (não requer login) |
| 🔒 | Tela protegida (requer autenticação) |
| 👑 | Apenas ADMIN |
| 🛒 | Apenas COMPRADOR (próprios dados) |
| 👑🛒 | Ambos (ADMIN vê tudo, COMPRADOR vê só os próprios) |

---

## 🌐 Fluxo Geral de Navegação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CONTROLE DE GASTOS                              │
└─────────────────────────────────────────────────────────────────────────────┘

    🔓 /                    ──►  Redireciona para /login
         │
         ▼
    🔓 /login             ──►  Tela de login (credentials)
         │
         ├── Login válido + primeiro acesso = true
         │      └──► 🔓 /trocar-senha
         │
         └── Login válido + papel = ADMIN
         │      └──► 🔒 /admin (Dashboard Admin)
         │
         └── Login válido + papel = COMPRADOR
                └──► 🔒 /comprador (Dashboard Comprador)
```

---

## 📱 Detalhamento das Telas

### 🔓 Área Pública — Autenticação

#### `/login` — Login
- **URL:** `/login`
- **Acesso:** Público (não autenticado)
- **Descrição:** Formulário de login com campos `login` e `senha`.
- **Regras:**
  - Credenciais inválidas → mensagem de erro
  - Credenciais válidas + `primeiroLogin = true` → redireciona para `/trocar-senha`
  - Credenciais válidas + `papel = ADMIN` → redireciona para `/admin`
  - Credenciais válidas + `papel = COMPRADOR` → redireciona para `/comprador`
- **Componentes:** `Input.tsx`, `Botao.tsx`
- **APIs consumidas:** `POST /api/auth/[...nextauth]` (authorize)

---

#### `/trocar-senha` — Troca de Senha (Primeiro Acesso)
- **URL:** `/trocar-senha`
- **Acesso:** Público (mas requer sessão JWT ativa)
- **Descrição:** Tela para definir nova senha no primeiro acesso.
- **Regras:**
  - Senha mínima 5 caracteres
  - Após troca, chama API para atualizar `primeiroLogin = false`
  - Logout forçado para renovar JWT
  - Redireciona para `/login`
- **APIs consumidas:** `POST /api/auth/alterar-senha`

---

### 🔒 Área Protegida — Sistema

#### `/admin` — Dashboard do Administrador
- **URL:** `/admin`
- **Acesso:** 👑 Apenas ADMIN
- **Descrição:** Visão geral de todos os compradores com resumo financeiro.
- **Conteúdo:**
  - Lista de compradores (nome, total de compras, total a pagar)
  - Ordenação por nome
  - Botão "Cadastrar Comprador" → abre `ModalCadastroComprador`
  - Cada linha clicável → navega para `/admin/comprador/[id]`
- **Componentes:** `PaginaAdminCliente.tsx`, `TabelaBase.tsx`, `Botao.tsx`, `ModalCadastroComprador.tsx`
- **APIs consumidas:** `GET /api/usuarios`

---

#### `/admin/comprador/[id]` — Detalhes do Comprador (Visão Admin)
- **URL:** `/admin/comprador/:id`
- **Acesso:** 👑 Apenas ADMIN
- **Descrição:** Visão completa de um comprador específico, com todas as compras, corridas Uber e controle mensal.
- **Conteúdo:**
  - Dados do comprador (nome, flag Uber, login)
  - Ações: Editar comprador, Resetar senha, Excluir comprador
  - Seletor de mês/ano (`SeletorMes.tsx`)
  - Cards resumo:
    - `CardDividaAnterior.tsx` — dívida rolante
    - `CardUber.tsx` — total de corridas no mês
    - Total de compras do mês
    - Total consolidado (compras + uber + dívida)
  - Tabela de compras do mês (`TabelaCompras.tsx`)
  - Botões:
    - "Cadastrar Compra" → `ModalCadastroCompra.tsx`
    - "Cadastrar Corrida" → `ModalCadastroCorrida.tsx` (se usa Uber)
    - "Registrar Pagamento" → `ModalPagamento.tsx`
    - "Fechar Mês"
  - Modal de edição de compra (`ModalEditarCompra.tsx`)
- **Componentes:** `PaginaCompradorAdminCliente.tsx`, `SeletorMes.tsx`, `CardDividaAnterior.tsx`, `CardUber.tsx`, `TabelaCompras.tsx`, modais
- **APIs consumidas:**
  - `GET /api/usuarios/[id]`
  - `GET /api/compras/usuario?usuarioId=[id]&mes=[m]&ano=[a]`
  - `GET /api/corridas/usuario?usuarioId=[id]&mesReferencia=[m]&anoReferencia=[a]`
  - `GET /api/meses?usuarioId=[id]`
  - `POST /api/compras`
  - `PUT /api/compras/[id]`
  - `DELETE /api/compras/[id]`
  - `POST /api/corridas`
  - `DELETE /api/corridas/[id]`
  - `POST /api/meses` (fechamento)

---

#### `/comprador` — Dashboard do Comprador
- **URL:** `/comprador`
- **Acesso:** 🛒 Apenas COMPRADOR (próprios dados)
- **Descrição:** Visão resumida do comprador logado.
- **Conteúdo:**
  - Seletor de mês/ano
  - Cards resumo (mesma estrutura da tela admin, mas só dados do próprio usuário)
  - Tabela de compras do mês
  - Card de corridas Uber (se `usaUber = true`)
- **Componentes:** `PaginaCompradorCliente.tsx`, `SeletorMes.tsx`, `CardDividaAnterior.tsx`, `CardUber.tsx`, `TabelaCompras.tsx`
- **APIs consumidas:**
  - `GET /api/compras/usuario?usuarioId=[proprioId]&mes=[m]&ano=[a]`
  - `GET /api/corridas/usuario?usuarioId=[proprioId]&mesReferencia=[m]&anoReferencia=[a]`
  - `GET /api/meses?usuarioId=[proprioId]`

---

## 🔄 Fluxos de Negócio

### Fluxo 1: Cadastro de Comprador
```
Admin em /admin
    └── Clica "Cadastrar Comprador"
        └── ModalCadastroComprador.tsx abre
            └── Preenche nome, sobrenome, flag Uber
                └── Clica "Salvar"
                    └── POST /api/usuarios
                        └── usuario.service.ts gera login automático
                            └── usuario.repository.ts persiste
                                └── Retorna novo comprador
                                    └── Modal fecha + tabela atualiza
```

### Fluxo 2: Cadastro de Compra (com parcelamento)
```
Admin em /admin/comprador/[id]
    └── Clica "Cadastrar Compra"
        └── ModalCadastroCompra.tsx abre
            └── Preenche: cartão, descrição, mês da compra, mês início, qtd parcelas, valor parcela
                └── Preview automático de parcelas (calcularMesFinal)
                └── Clica "Salvar"
                    └── POST /api/compras
                        └── compra.schema.ts valida (Zod)
                        └── compra.service.ts calcula mesFinal
                        └── compra.repository.ts persiste
                            └── Retorna compra criada
                                └── Modal fecha + tabela atualiza
```

### Fluxo 3: Fechamento de Mês
```
Admin em /admin/comprador/[id]
    └── Seleciona mês/ano no SeletorMes
        └── Clica "Fechar Mês" ou "Registrar Pagamento"
            └── ModalPagamento.tsx abre (se pagamento parcial)
                └── Preenche valor pago
                    └── POST /api/meses
                        └── mes.service.ts calcula:
                            - totalDoMes = compras + uber + dividaAnterior
                            - dividaAnterior = totalDoMes - totalPago
                        └── mes.repository.ts persiste MesFechado
                            └── Mês marcado como fechado
                                └── Próximo mês inicia com dívida anterior
```

### Fluxo 4: Primeiro Acesso do Comprador
```
Comprador recebe login/senha padrão
    └── Acessa /login
        └── Entra com credenciais
            └── primeiroLogin = true
                └── Redireciona /trocar-senha
                    └── Define nova senha (mín. 5 chars)
                        └── POST /api/auth/alterar-senha
                            └── primeiroLogin = false
                                └── Logout forçado
                                    └── Redireciona /login
                                        └── Login novamente
                                            └── Redireciona /comprador
```

---

## 🛡️ Matriz de Permissões por Tela

| Tela | ADMIN | COMPRADOR | Não Autenticado |
|---|---|---|---|
| `/login` | ✅ | ✅ | ✅ |
| `/trocar-senha` | ✅* | ✅* | ❌ |
| `/admin` | ✅ | ❌ (redirect) | ❌ (redirect) |
| `/admin/comprador/[id]` | ✅ | ❌ (403) | ❌ (401) |
| `/comprador` | ✅** | ✅ | ❌ (redirect) |

\* Requer sessão ativa + primeiroLogin = true  
\** ADMIN pode acessar, mas verá dados de qualquer comprador se navegar direto

---

## 📡 Resumo de APIs por Tela

| Tela | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| `/admin` | `/api/usuarios` | `/api/usuarios` | — | `/api/usuarios/[id]` |
| `/admin/comprador/[id]` | `/api/usuarios/[id]`, `/api/compras/usuario`, `/api/corridas/usuario`, `/api/meses` | `/api/compras`, `/api/corridas`, `/api/meses` | `/api/compras/[id]`, `/api/usuarios/[id]` | `/api/compras/[id]`, `/api/corridas/[id]`, `/api/usuarios/[id]` |
| `/comprador` | `/api/compras/usuario`, `/api/corridas/usuario`, `/api/meses` | — | — | — |

---

*Documento gerado em 2026-05-15. Atualizar conforme novas telas forem adicionadas.*
