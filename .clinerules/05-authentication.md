# Autenticação

## Biblioteca oficial

Usar Better Auth.

Não implementar autenticação manual com JWT se Better Auth já estiver configurado.

## Estratégia inicial do MVP

Começar com:

- Login por e-mail e senha.
- Sessão segura.
- Roles no banco.

Não iniciar com Google OAuth, a menos que o usuário peça explicitamente.

Google OAuth é opcional e pode ser adicionado depois.

## Perfis iniciais

- `admin`: acessa tudo.
- `consultant`: acessa clientes vinculados.
- `client`: acesso futuro ao portal do cliente.

Para o MVP interno, priorizar `admin` e `consultant`.

## Regras

- Proteger rotas privadas.
- Nunca confiar em dados do frontend para autorização.
- Toda consulta sensível deve validar usuário e role.
- Em contexto multiempresa, validar se o usuário pode acessar a empresa solicitada.
- Não armazenar senha manualmente se Better Auth estiver gerenciando credenciais.

## Rotas esperadas

As rotas podem ser geradas/gerenciadas pelo Better Auth.

Também criar endpoint auxiliar:

```txt
GET /users/me
```

para retornar dados úteis da sessão no frontend.
