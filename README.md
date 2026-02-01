# EcoTrack - Sustainable Metrics Ecosystem

O **EcoTrack** é um ecossistema de alta escala desenvolvido para monitorar e processar métricas de sustentabilidade em tempo real. O projeto utiliza uma arquitetura de monorepo orquestrada pelo **Nx** para integrar múltiplos serviços, garantindo consistência técnica e agilidade no desenvolvimento.

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

**Fase 1: O Alicerce (MVP)**

- [x] Configurar NX Workspace e Apps base.
- [x] Padronizar comandos e portas de execução.
- [ ] Setup do Docker Compose (Postgres + Redis).
- [ ] CRUD inicial com NestJS e Drizzle.

**Fase 2: Mensageria e Escalabilidade**

- [ ] Integração com RabbitMQ para processamento assíncrono.
- [ ] Implementação de cache com Redis.

**Fase 3: Qualidade e Monitoramento**

- [ ] Testes E2E com Playwright.
- [ ] Monitoramento com Prometheus/Grafana.
