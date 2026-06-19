# Git e Commits

## Padrão obrigatório

Utilizar Conventional Commits.

Tipos permitidos:

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `refactor`: refatoração sem alteração de comportamento
- `perf`: melhoria de performance
- `style`: alterações visuais ou formatação
- `docs`: documentação
- `test`: testes
- `build`: build, dependências e configuração
- `chore`: tarefas gerais sem impacto funcional

## Exemplos

```txt
feat(companies): create companies CRUD
feat(diagnostics): implement diagnostic scoring
fix(auth): correct session validation
refactor(crm): simplify lead service
docs(project): update architecture documentation
```

## Regra

Antes de criar um commit, informar:

- Arquivos alterados
- Objetivo da alteração
- Mensagem sugerida do commit

## Nunca fazer automaticamente

Não executar sem aprovação explícita:

```bash
git push
git push --force
git rebase
git reset --hard
```

## Commits pequenos

Preferir commits focados.

Bom:

```txt
feat(companies): create companies module
feat(companies): add company validation
feat(companies): add company tests
```

Ruim:

```txt
feat: create whole platform
```

## Regra para migrations

Toda migration importante deve ter commit separado.

Exemplo:

```txt
feat(database): add companies table
feat(database): add diagnostics tables
```

## Regra para mudanças estruturais

Alterações em Better Auth, Drizzle, Docker, CI/CD ou monorepo devem possuir commit exclusivo.
