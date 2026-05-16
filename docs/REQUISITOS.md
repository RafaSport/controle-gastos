# 📋 Requisitos do Sistema — Controle de Gastos

> Especificação de requisitos funcionais e não-funcionais  
> Baseado nas análises do Codex e Cline + funcionalidades existentes

---

## 1. Requisitos Funcionais (RF)

### 🔐 RF-AUT — Autenticação e Autorização

| ID | Requisito | Prioridade |
|---|---|---|
| RF-AUT-01 | O sistema deve permitir login via credenciais (login + senha) | Alta |
| RF-AUT-02 | O sistema deve diferenciar dois papéis: ADMIN e COMPRADOR | Alta |
| RF-AUT-03 | O sistema deve forçar troca de senha no primeiro acesso | Alta |
| RF-AUT-04 | O sistema deve fazer logout automático ao fechar o navegador | Alta |
| RF-AUT-05 | A sessão JWT deve expirar em 3 minutos de inatividade | Média |
| RF-AUT-06 | O sistema deve proteger todas as rotas da API com autenticação | Alta |
| RF-AUT-07 | O sistema deve validar papel (RBAC) em cada rota administrativa | Alta |
| RF-AUT-08 | Um COMPRADOR não deve conseguir acessar dados de outro comprador | Alta |

---

### 👑 RF-ADM — Funcionalidades do Administrador

| ID | Requisito | Prioridade |
|---|---|---|
| RF-ADM-01 | O ADMIN deve visualizar lista de todos os compradores | Alta |
| RF-ADM-02 | O ADMIN deve cadastrar novo comprador (nome, sobrenome, flag Uber) | Alta |
| RF-ADM-03 | O sistema deve gerar login automático no cadastro do comprador | Alta |
| RF-ADM-04 | O ADMIN deve editar nome, sobrenome e flag Uber do comprador | Alta |
| RF-ADM-05 | O ADMIN deve resetar a senha de um comprador para o padrão | Média |
| RF-ADM-06 | O ADMIN deve excluir um comprador (com cascade em compras, meses e corridas) | Alta |
| RF-ADM-07 | O ADMIN deve visualizar todas as compras de um comprador específico | Alta |
| RF-ADM-08 | O ADMIN deve cadastrar compras parceladas para um comprador | Alta |
| RF-ADM-09 | O sistema deve calcular automaticamente o mês final da compra | Alta |
| RF-ADM-10 | O ADMIN deve editar uma compra existente | Alta |
| RF-ADM-11 | O ADMIN deve excluir uma compra | Alta |
| RF-ADM-12 | O ADMIN deve cadastrar corridas Uber para compradores com flag Uber | Média |
| RF-ADM-13 | O ADMIN deve excluir corridas Uber | Média |
| RF-ADM-14 | O ADMIN deve registrar pagamento (total ou parcial) de um mês | Alta |
| RF-ADM-15 | O sistema deve calcular dívida anterior automaticamente ao fechar mês | Alta |
| RF-ADM-16 | O ADMIN deve visualizar resumo mensal: total compras, total Uber, dívida anterior, total consolidado | Alta |

---

### 🛒 RF-COM — Funcionalidades do Comprador

| ID | Requisito | Prioridade |
|---|---|---|
| RF-COM-01 | O COMPRADOR deve visualizar apenas suas próprias compras | Alta |
| RF-COM-02 | O COMPRADOR deve filtrar compras por mês e ano | Alta |
| RF-COM-03 | O COMPRADOR deve visualizar parcelas ativas no mês selecionado | Alta |
| RF-COM-04 | O COMPRADOR deve visualizar total de compras do mês | Alta |
| RF-COM-05 | O COMPRADOR deve visualizar total de corridas Uber do mês (se aplica) | Média |
| RF-COM-06 | O COMPRADOR deve visualizar dívida anterior (rolante) | Alta |
| RF-COM-07 | O COMPRADOR deve visualizar total consolidado do mês | Alta |
| RF-COM-08 | O COMPRADOR deve alterar sua própria senha | Média |

---

### 💳 RF-CMP — Regras de Compra

| ID | Requisito | Prioridade |
|---|---|---|
| RF-CMP-01 | Uma compra deve ter: cartão, descrição, mês da compra, mês início, quantidade de parcelas, valor da parcela | Alta |
| RF-CMP-02 | O cartão deve ser um dos valores: NUBANK, INTER, HIPER, ITAU | Alta |
| RF-CMP-03 | O mês da compra não pode ser futuro | Alta |
| RF-CMP-04 | O sistema deve alertar se o mês da compra for 3+ meses no passado | Média |
| RF-CMP-05 | O mês final deve ser calculado automaticamente: mesInicio + qtdParcelas - 1 | Alta |
| RF-CMP-06 | O valor da parcela deve ser maior que zero | Alta |
| RF-CMP-07 | A descrição não pode ser vazia | Alta |

---

### 📅 RF-MES — Regras de Fechamento de Mês

| ID | Requisito | Prioridade |
|---|---|---|
| RF-MES-01 | O sistema deve permitir fechar um mês por comprador | Alta |
| RF-MES-02 | O fechamento deve calcular: totalDoMes = comprasDoMes + uberDoMes + dividaAnterior | Alta |
| RF-MES-03 | O fechamento deve registrar o valor pago (total ou parcial) | Alta |
| RF-MES-04 | A dívida anterior do próximo mês deve ser: totalDoMes - totalPago | Alta |
| RF-MES-05 | Um mês fechado não pode ser reaberto (sem ação manual de desfazer) | Média |
| RF-MES-06 | O sistema deve impedir fechamento duplicado do mesmo mês/ano para o mesmo comprador | Alta |

---

### 🚗 RF-UBR — Regras de Corridas Uber

| ID | Requisito | Prioridade |
|---|---|---|
| RF-UBR-01 | Apenas compradores com flag `usaUber = true` podem ter corridas | Alta |
| RF-UBR-02 | Uma corrida deve ter: data, mês de referência, ano de referência, valor | Alta |
| RF-UBR-03 | A data da corrida deve ser formatada em UTC para evitar deslocamento de fuso | Média |

---

## 2. Requisitos Não-Funcionais (RNF)

### ⚡ RNF-DES — Desempenho

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-DES-01 | O tempo de resposta das APIs deve ser < 500ms para 95% das requisições | Alta |
| RNF-DES-02 | O build de produção deve ser otimizado (Next.js output: standalone) | Média |
| RNF-DES-03 | As páginas protegidas devem usar SSR para verificação de sessão | Alta |

---

### 🛡️ RNF-SEG — Segurança

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-SEG-01 | Senhas devem ser armazenadas com hash bcrypt (salt 10+) | Alta |
| RNF-SEG-02 | Variáveis de ambiente (DB, AUTH_SECRET) não devem estar no repositório | Alta |
| RNF-SEG-03 | Todas as APIs devem validar autenticação e autorização | Alta |
| RNF-SEG-04 | Dados de entrada devem ser validados com Zod antes de processar | Alta |
| RNF-SEG-05 | O sistema deve usar HTTPS em produção | Alta |

---

### 🔧 RNF-MAN — Manutenibilidade

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-MAN-01 | O código deve usar TypeScript com strict mode ativado | Alta |
| RNF-MAN-02 | Não deve haver uso de `as any` em repositories e services | Alta |
| RNF-MAN-03 | Regras de negócio devem estar centralizadas em helpers/services | Alta |
| RNF-MAN-04 | Componentes devem ter responsabilidade única (< 150 linhas ideal) | Média |
| RNF-MAN-05 | O projeto deve ter testes unitários para cálculos financeiros | Média |

---

### ♿ RNF-ACE — Acessibilidade e UX

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-ACE-01 | Todas as telas devem ser responsivas (mobile-first) | Média |
| RNF-ACE-02 | Modais devem ter tratamento visual de erro amigável | Média |
| RNF-ACE-03 | Textos devem usar encoding UTF-8 (sem entidades HTML) | Média |
| RNF-ACE-04 | O sistema deve ter feedback visual de carregamento (spinner/skeleton) | Baixa |

---

## 3. Regras de Negócio Consolidadas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REGRAS DE NEGÓCIO                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Comprador tem compras parceladas.                                        │
│  2. Compra tem: mês da compra, mês início, quantidade de parcelas, mês final.│
│  3. Mês pode ser fechado pelo ADMIN.                                         │
│  4. Pagamento parcial vira dívida anterior (rolante).                      │
│  5. Usuário pode ter Uber (flag usaUber).                                    │
│  6. ADMIN gerencia compradores, compras, corridas e fechamentos.         │
│  7. COMPRADOR vê apenas seus dados.                                        │
│  8. Cálculo de índice de mês: ano * 12 + mes (usado internamente).         │
│  9. Cálculo de mês final: mesInicio + qtdParcelas - 1.                     │
│ 10. Dívida anterior = totalDoMes - totalPago.                              │
│ 11. Total consolidado = comprasDoMes + uberDoMes + dividaAnterior.        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*Documento gerado em 2026-05-15. Revisar conforme evolução do sistema.*
