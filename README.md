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
