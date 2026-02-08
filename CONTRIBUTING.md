# Guia de Contribuição - EcoTrack

## Fluxo de Desenvolvimento (CI/CD)

Este projeto utiliza **Trunk Based Development** com uma pipeline de CI/CD automatizada no GitHub Actions.

### Branches

- **`main`**: Branch protegida e estável. Representa a produção.
- **`feat/...`, `fix/...`**: Branches temporárias para desenvolvimento de features ou correções. Devem ser mergeadas na `main` via Pull Request.

### Commits

Utilizamos a convenção **Conventional Commits**.

- Recomendamos usar `npm run commit` para gerar commits interativamente.
- Os commits são validados localmente (husky) e no CI.

**Tipos comuns:**

- `feat`: Nova funcionalidade.
- `fix`: Correção de bug.
- `docs`: Documentação.
- `style`: Formatação, validação de estilo, etc.
- `refactor`: Refatoração de código.
- `test`: Adição ou refatoração de testes.
- `chore`: Tarefas de build, auxiliares, etc.

### Pull Requests

1. Crie uma branch a partir da `main`.
2. Faça seus commits usando `git add .` e `npm run commit`.
3. Abra um Pull Request para a `main`.
4. **IMPORTANTE**: O **Título do PR** deve seguir o padrão Conventional Commits (ex: `feat: add user login`).
   - O GitHub Actions validará o título do PR.
   - Ao mergear, usamos **"Squash and Merge"**, o título do PR será o commit final na `main` e configurará a versão.
5. O CI rodará testes, lint e build.
6. Após aprovação e merge, a pipeline de Release será disparada.

### Release Automático

- O projeto usa **Semantic Release**.
- Após o merge na `main`, a versão será incrementada automaticamente baseada no commit (que veio do título do PR).
- Um novo release será criado no GitHub e o `package.json/CHANGELOG.md` serão atualizados.

## Configuração Local

1. Instale as dependências: `npm install`
2. Prepare os hooks do git: `npm run prepare` (feito automaticamente no install)
