# EcoTrack - Sustainable Metrics Ecosystem

O **EcoTrack** é um projeto de estudo desenvoldido para monitorar e processar métricas de sustentabilidade, com o objetivo de evoluir como desenvolvedor Full Stack e estudar arquiteturas de software. O projeto utiliza uma arquitetura de monorepo orquestrada pelo **Nx** para integrar múltiplos serviços, garantindo consistência técnica e agilidade no desenvolvimento. O foco é construir uma aplicação simples (MVP), porém robusta e bem arquitetada.

---

### 🎯 Objetivo do Projeto

- **Finalidade:** Objeto de estudo para prática de arquitetura Monorepo, Mensageria e estratégias de Renderização.
- **Deadline:** 🗓️ **08 de Fevereiro de 2026**.
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
- **Vitest:** Testes unitários de alta performance.

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

## 📝 Roadmap de Implementação

**Fase 1: Infraestrutura e Base de Dados**

- [x] Configurar NX Workspace e Apps base.
- [x] Padronizar comandos e portas de execução.
- [x] Configurar Docker e Docker Compose (Postgres, Redis, RabbitMQ).
- [x] Criar `packages/database` (Drizzle schemas + migrations centralizadas).
- [ ] Instalar Vitest para testes unitários (Nest e Next).
- [ ] Configurar pipeline de CI/CD.

**Fase 2: Arquitetura de Bibliotecas (Libs)**

- [ ] Criar `libs/domain` (Tipos e interfaces compartilhadas).
- [ ] Criar `libs/shared-utils` (Formatadores, utilitários comuns).
- [ ] Criar `libs/ui` (Shadcn + Tailwind - Componentes visuais).

**Fase 3: Backend e Mensageria**

- [ ] Configurar NestJS na `apps/api` (Express + Swagger).
- [ ] Criar `apps/worker` (Microserviço para processamento de filas RabbitMQ).
- [ ] Configurar Redis para cache e RabbitMQ para mensageria.
- [ ] Subir a api e o worker em containers separados e disponíveis para uso.

**Fase 4: Frontend e Web Server**

- [ ] Setup completo do Next.js (Shadcn, Tailwind, TanStack Query, Zustand, Hookform, Fontsource).
- [ ] Configurar Nginx para o Next.js.

**Fase 5: Design e Planejamento do MVP**

- [ ] Planejamento detalhado: Diagramas de arquitetura e rotas do MVP.
- [ ] Definição de identidade visual e fluxos do Dashboard.

**Fase 6: Desenvolvimento Core (Ingestão e Processamento)**

- [ ] Implementar modelagem de dados (Drizzle no `packages/database`).
- [ ] Criar endpoints de recepção de métricas na `apps/api` (validação com Zod).
- [ ] Implementar lógica de processamento assíncrono no `apps/worker` via RabbitMQ.
- [ ] Configurar persistência e cache de resultados no Redis.
- [ ] Testes de integração e fluxo de dados ponta-a-ponta (API -> Worker -> DB).

**Fase 7: Frontend e Renderização (Foco de Estudo)**

- [ ] Implementar Identidade Visual e Dashboard (Shadcn + Lucide).
- [ ] **Prática de Renderização:** Criar páginas extras para comparar **SSR**, **ISR** e **SSG**.
- [ ] Configurar consumo de dados e cache (TanStack Query + Zustand).
- [ ] Testes de performance e responsividade.

**Fase 8: Finalização e Deploy (Deadline: 08/02)**

- [ ] Ajustes finais de ambiente (Nginx, Docker Compose).
- [ ] Deploy do MVP e verificação final.
- [ ] Opcional (se houver tempo): Auth com JWT e Cookie HttpOnly.
