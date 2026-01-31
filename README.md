# EcoTrack - Sustainable Metrics Ecosystem

O **EcoTrack** é um ecossistema de alta escala desenvolvido para monitorar e processar métricas de sustentabilidade em tempo real. O projeto utiliza uma arquitetura de monorepo para integrar múltiplos serviços, garantindo consistência técnica e agilidade no desenvolvimento.

## 🚀 Tecnologias Core

### Monorepo & Tooling
- **NX:** Orquestração de monorepo e build system.
- **Commitzen & Husky:** Padronização de commits e git hooks.
- **Vitest:** Testes unitários de alta performance.

### Frontend (Next.js App)
- **Next.js 16 (App Router)**
- **Tailwind CSS & Shadcn/UI:** Interface moderna e acessível.
- **TanStack Query (React Query):** Gerenciamento de estado de servidor.
- **Zustand:** Estado global leve.
- **Zod & React Hook Form:** Validação de formulários robusta.

### Backend (NestJS)
- **NestJS (Express):** API Gateway e serviços de processamento.
- **Drizzle ORM:** TypeScript-first ORM para interação com **PostgreSQL**.
- **RabbitMQ:** Mensageria assíncrona para processamento de métricas.
- **Redis:** Camada de cache para leitura rápida de dashboards.

### DevOps & Infra
- **Docker & Docker Compose:** Containerização de todo o ambiente.
- **Nginx:** Proxy reverso para roteamento de tráfego local.
- **GitHub Actions:** Pipeline de CI/CD para testes e builds automatizados.

## Arquitetura do Sistema

O projeto é dividido em três aplicações principais dentro do monorepo:

1.  **Web Dashboard (Next.js):** Interface administrativa para visualização de dados.
2.  **API Gateway (NestJS):** Ponto de entrada que recebe dados e os despacha para filas.
3.  **Metrics Worker (NestJS):** Serviço isolado que consome o RabbitMQ, aplica regras de negócio e persiste no banco.



## 🛠️ Como rodar o projeto

(Em breve: Instruções de Docker Compose)

## Proposta de Projeto

Arquitetura do MVP:
    
    App Frontend (Next.js): Dashboard para visualizar métricas em tempo real e cadastrar novos sensores.

    API Gateway (NestJS): Recebe requisições, valida com Zod e envia para a fila (RabbitMQ).

    Worker Service (NestJS): Consome a fila, processa os dados (ex: cálculo de média de CO2) e salva no PostgreSQL.

    Cache (Redis): Armazena o "Estado Atual" dos sensores para que o dashboard não precise consultar o banco toda hora.

Estrutura do monorepo NX seria:

    apps/
        web-dashboard (Next.js)
        api-gateway (NestJS)
        data-processor (NestJS - Worker)
    libs/
        ui-components (Shadcn + Tailwind)
        shared-schemas (Zod schemas compartilhados entre Front e Back)
        domain (Drizzle schemas + Zod - Compartilhado entre API e Worker)

Fluxo de CI/CD (GitHub Actions):

    Lint/Test: Husky impede commits ruins. O GitHub Actions roda nx affected:test (testa só o que mudou).
    Build: Gera as imagens Docker.
    Simulação de Deploy: Utilizar o Docker Compose para subir todo o ambiente (DB, Redis, Rabbit, Web, API) com um único comando.

Roteiro de Implementação:

Fase 1: O Alicerce (MVP)

    Configurar o NX Workspace com as apps.
    Setup do Docker Compose básico (Postgres + Redis).
    Criar um CRUD simples no NestJS com Swagger e Drizzle.
    Frontend Next.js consumindo a API com TanStack Query.

Fase 2: Mensageria e Background Jobs

    Adicionar RabbitMQ ao Docker Compose.
    Transformar o salvamento de dados em um processo assíncrono: a API posta na fila, o Worker salva no banco.
    Implementar Cache Read-aside com Redis na API.

Fase 3: Qualidade e Automação

    Configurar Husky, Commitzen e Lint-staged.
    Criar testes unitários no Back e Testes de E2E com Playwright no Front.
    Configurar o workflow do GitHub Actions para validar o nx affected.

Fase 4: Complexidade Avançada (Escalabilidade)

    WebSockets: Fazer o Worker avisar o Frontend via Socket.io (ou via Redis Pub/Sub) que o dado foi processado, atualizando o gráfico em tempo real sem refresh.
    Prometheus/Grafana: Adicionar containers de monitoramento para ler métricas da API NestJS.

