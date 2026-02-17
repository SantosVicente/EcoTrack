# EcoTrack - Sustainable Metrics Ecosystem

O **EcoTrack** é um projeto de estudo desenvolvido para monitorar e processar métricas de sustentabilidade, com o objetivo de evoluir como desenvolvedor Full Stack e estudar arquiteturas de software. O objetivo é integrar múltiplos serviços, garantindo consistência técnica e agilidade no desenvolvimento. O foco é construir uma aplicação simples, escalável e funcional.

---

### 🎯 Objetivo do Projeto

- **Finalidade:** Objeto de estudo para prática de arquitetura Monorepo, Mensageria e estratégias de Renderização.
- **Foco:** Simplicidade e clareza. Poucos CRUDs, foco no fluxo de dados e performance.

### 📚 Stack de Estudo

- **Backend:** NestJS (Express), RabbitMQ (Worker), Redis (Cache), Drizzle + Postgres.
- **Frontend:** Next.js (SSR/ISR/SSG), Shadcn/UI, Zustand, TanStack Query.
- **Tooling:** NX, Commitzen, Husky, lint-staged, Vitest, Docker, Nginx.

---

## 🚀 Tecnologias Core

### Monorepo & Tooling

- **NX:** Orquestração de monorepo e build system inteligente.
- **Commitzen & Husky:** Padronização de commits e git hooks para qualidade de código.
- **Vitest & Playwright:** Testes de alta performance.

### Frontend (Next.js App)

- **Next.js 16 (App Router)**
- **Tailwind CSS & Shadcn/UI:** Interface moderna, responsiva e acessível.
- **TanStack Query (React Query):** Gerenciamento eficiente de estado de servidor e cache.
- **Zustand:** Gerenciamento de estado global leve.

### Backend (NestJS)

- **NestJS (Express):** API Gateway robusto e serviços de processamento assíncrono.
- **Drizzle ORM:** TypeScript-first ORM para interação segura com **PostgreSQL**.
- **RabbitMQ:** Mensageria para desacoplamento e processamento escalável.

---

## 🛠️ Como Rodar o Projeto

Este monorepo utiliza o **Nx** para gerenciar as aplicações. Os comandos devem ser executados na **raiz do projeto**.

### 1. Rodar Tudo em Paralelo (Recomendado)

Para iniciar tanto o Frontend quanto o Backend simultaneamente:

```bash
npm run dev:all
```

_Este comando utiliza `nx run-many` para subir todos os serviços de desenvolvimento de uma vez._

### 2. Rodar Aplicações Individualmente

Se preferir rodar em terminais separados:

**Frontend (Next.js)**

- `npm run web:dev`
- **URL:** [http://localhost:3000](http://localhost:3000)

**Backend (NestJS)**

- `npm run api:dev`
- **URL:** [http://localhost:3333/api](http://localhost:3333/api)

---

## 📡 Configuração de Portas

Para evitar conflitos de execução simultânea, as portas foram padronizadas:

| Serviço         | Tecnologia | Porta  | Contexto                  |
| :-------------- | :--------- | :----- | :------------------------ |
| **Página Web**  | Next.js    | `3000` | Dashboard de indicadores  |
| **API Gateway** | NestJS     | `3333` | Endpoint principal da API |

---

## 🏗️ Arquitetura do Sistema

O projeto é estruturado dentro da pasta `apps/`:

1.  **web (`apps/web`):** Dashboard administrativo para visualização de métricas.
2.  **api (`apps/api`):** Gateway que recebe dados, valida e despacha para processamento.

### Outros Comandos Úteis

- `npm run api:build` / `npm run web:build`: Gera o build de produção.
- `npm run api:lint` / `npm run web:lint`: Executa a verificação estética e de erros do código.
- `npx nx graph`: Abre uma interface visual para ver as dependências do projeto.

---

## 🤝 Como Contribuir (Commits)

Este projeto utiliza o **Commitzen** e o padrão **Conventional Commits** para manter um histórico de commits limpo e padronizado.

### Realizando um Commit

Em vez de usar `git commit`, utilize o comando abaixo na raiz do projeto:

```bash
npm run commit
```

Isso abrirá uma interface interativa que guiará você na criação de um commit padronizado:

1. **Tipo:** Selecione o tipo de alteração (ex: `feat`, `fix`, `docs`, `style`, `refactor`, etc).
2. **Escopo:** Informe o escopo da alteração (ex: `web`, `api`, `auth`, `ui`).
3. **Assunto:** Uma descrição curta e clara no imperativo.
4. **Corpo:** Uma descrição mais detalhada da alteração (opcional).
5. **Rodapé:** Referências a issues ou breaking changes (opcional).

---

## Requisitos Funcionais (RFs)

1. Ingestão e Processamento de Métrica:
   RF-01: O sistema deve permitir a ingestão de métricas de sustentabilidade (Energia, Água, Resíduos, Carbono) via API.
   RF-02: O sistema deve validar os dados recebidos utilizando esquemas definidos (Zod).
   RF-03: O sistema deve enfileirar as métricas recebidas para processamento assíncrono (RabbitMQ).
   RF-04: O sistema deve processar as métricas brutas para calcular valores derivados (por exemplo, pegada de carbono com base no consumo de energia em kWh).
   RF-05: O sistema deve persistir os dados brutos e processados ​​no banco de dados.

2. Painel de Controle e Visualização
   RF-06: O sistema deve exibir um painel de controle em tempo real com indicadores-chave de desempenho de sustentabilidade.
   RF-07: O sistema deve permitir que os usuários filtrem as métricas por intervalo de datas, tipo e local/fonte.
   RF-08: O sistema deve fornecer gráficos visuais (linha, barra, pizza) para tendências das métricas ao longo do tempo.
   RF-09: O sistema deve exibir uma seção de "Alertas Críticos" para métricas que excedam os limites definidos.

## Non-Functional Requirements (NFRs)

1. Desempenho e Escalabilidade
   NFR-01: O painel deve carregar as métricas críticas rapidamente.
   NFR-02: O sistema deve garantir que não haja perda de dados durante falhas de processamento usando padrões de confirmação de mensagens (Ack/Nack).
   NFR-03: O sistema deve implementar mecanismos de repetição para tarefas com falha.

2. Arquitetura e Padrões
   NFR-04: O código deve seguir padrões arquitetônicos específicos: Monorepo (Nx).
   NFR-05: Todo o código deve ser estritamente tipado (TypeScript).
   NFR-06: A interface do usuário deve seguir o Sistema de Design definido usando Shadcn/UI e Tailwind CSS.

## Entidades de Domínio (Core)

1. Métrica: Representa um ponto de dados (ex.: 50 kWh).
2. Atributos: id, tipo (ENERGIA, ÁGUA, CARBONO), valor, unidade, carimbo de data/hora, id_origem.
3. Alerta: Gerado quando uma métrica excede um limite.
4. Origem: A origem da métrica (ex.: "Edifício A - Sala de Servidores").

---

## 📝 Roadmap de Implementação

**Fase 1: Infraestrutura e Base de Dados**

- [x] Configurar NX Workspace e Apps base.
- [x] Padronizar comandos e portas de execução (Node.js v22).
- [x] Configurar Docker e Docker Compose (Postgres, Redis, RabbitMQ).
- [x] Criar `packages/database` (Drizzle schemas + migrations centralizadas).
- [x] Realizar Seed inicial do banco (John Doe).
- [x] Configurar pipeline de CI/CD (GitHub Actions, Semantic Release).

**Fase 2: Arquitetura de Bibliotecas (Libs/Packages)**

- [x] Criar `packages/domain` (Tipos e interfaces compartilhadas - Essencial para Auth e Ingestão).
- [x] Criar `packages/shared-utils` (Formatadores, utilitários comuns).
- [x] Criar `packages/ui` (Shadcn + Tailwind - Componentes visuais).

**Fase 3: Backend - API Heart & Auth (Detailed Plan)**

- [ ] **Setup de Infra NestJS:**
  - [ ] `ConfigModule` Global (Validação com Zod/Joi).
  - [ ] `DatabaseModule` (Integração com `packages/database`).
  - [ ] Filtros e Interceptors Globais.
  - [ ] Documentação Swagger Inicial.
- [ ] **Autenticação Segura (JWT via Cookie HttpOnly):**
  - [ ] Estratégias Passport (JwtStrategy, LocalStrategy, JwtRefreshStrategy).
  - [ ] `AuthService`: Login, Logout, Refresh e Validação.
  - [ ] `AuthController`: Gerenciamento de Cookies (httpOnly, secure, sameSite).
- [ ] **Módulos de Domínio (CRUDs):**
  - [ ] `UsersModule`: Perfil `/me` e Hash de senha.
  - [ ] `SourcesModule`: Gerenciamento de fontes de dados vinculadas ao usuário.
  - [ ] `ThresholdsModule`: Regras de alerta por fonte.

**Fase 4: Ingestão de Métricas & Worker**

- [ ] **Ingestion Module (API):**
  - [ ] Endpoint `POST /metrics` (Salvar PENDING e publicar no RabbitMQ).
  - [ ] Configuração de Producer RabbitMQ.
- [ ] **Worker Service (`apps/worker`):**
  - [ ] Criar Microserviço NestJS (Consumer RabbitMQ).
  - [ ] Lógica de Cálculo e Atualização no Banco.
- [ ] **Performance:**
  - [ ] Estratégia de Cache com Redis no Worker e API.

**Fase 5: Frontend Dashboard & Vitrine**

- [ ] Setup Next.js (Shadcn, Tailwind, TanStack Query).
- [ ] Autenticação: Integração com Cookies HttpOnly.
- [ ] Dashboard: Gráficos e Polling para status em tempo real.

**Fase 6: Finalização & Deploy**

- [ ] Testes E2E (Auth Flow).
- [ ] Ajustes de Nginx e Docker Cloud.
- [ ] Deploy Final.
