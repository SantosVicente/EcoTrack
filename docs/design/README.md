# Design System & UI/UX

Documentação das decisões de design.

## Links Úteis

- **Figma**: [Figma](https://www.figma.com/file/)
- **Storybook**: [Storybook](https://storybook.js.org/)

## Ativos

- [x] Paleta de Cores
- [x] Tipografia
- [x] Componentes Base

---

## 1. Identidade Visual

A identidade visual deve transmitir Sustentabilidade, Tecnologia e Clareza. Usaremos uma estética "Tecnológica e Ecológica": um modo escuro moderno e limpo com vibrantes detalhes em verde/turquesa.

### 1.1. Paleta de cores (Tailwind CSS Variables)

| Token                | Hex                    | Uso                                                          |
| :------------------- | :--------------------- | :----------------------------------------------------------- |
| `primary`            | `#05D69E` (Cyber Mint) | Ação principal, estados de sucesso e gradientes (com glow).  |
| `primary-foreground` | `#022C22` (Deep Green) | Texto de alto contraste sobre elementos primários vibrantes. |
| `secondary`          | `#1E293B` (Slate-800)  | Elementos interativos secundários, botões ghost (tech feel). |
| `background`         | `#020617` (Slate-950)  | Fundo "Void" profundo para imersão total.                    |
| `surface`            | `#0F172A` (Slate-900)  | Cards e painéis com efeito vidro (`backdrop-blur-xl`).       |
| `muted`              | `#94A3B8` (Slate-400)  | Texto de apoio legível em alto contraste.                    |
| `accent`             | `#38BDF8` (Sky-400)    | Detalhes futuristas e degradês complementares ao verde.      |
| `destructive`        | `#FB7185` (Rose-400)   | Alertas críticos suavizados para não quebrar a estética.     |
| `warning`            | `#FBBF24` (Amber-400)  | Alertas de atenção vivos.                                    |

### 1.2. Tipografia

- Fonte Principal: Inter ou Plus Jakarta Sans (Clean, modern san-serif).
- Headings: Bold, tight tracking.
- Numbers/Metrics: JetBrains Mono ou Geist Mono para tabelas de dados e KPIs para garantir o alinhamento tabular.

### 2. Estrutura do Layout

- Navegação lateral: Recolhível, escura (zinc-900), com ícones.
- Barra superior: Caminho de navegação, filtro de data global, perfil do usuário.
- Grade do painel: Grade responsiva de 12 colunas.
  - Linha 1: 4 cartões de KPIs (Energia, Água, Carbono, Alertas ativos).
  - Linha 2: Gráfico de tendência principal (visualização combinada).
  - Linha 3: Tabelas detalhadas / Atividade recente.

### 3. Telas Principais (Mockup)

#### Dashboard (Home)

- Header: "Visão Geral do EcoTrack" + Seletor de intervalo de datas.
- Linha de KPIs:
  - Energia: "1,240 kWh" (↓ 12% vs last week) - Icon: Zap
  - Water: "450 L" (↑ 2% vs last week) - Icon: Droplet
  - Carbon: "0.8 Tons" (Calculated) - Icon: Leaf
- Main Chart: "Tendências de uso de recursos" - Gráfico de linhas múltiplas alternável entre métricas.
- Recent Alerts: Lista de violações de limite (por exemplo, "Alto consumo de energia - Sala do servidor B").
