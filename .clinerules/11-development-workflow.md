# Fluxo de Trabalho Obrigatório

Antes de implementar qualquer funcionalidade:

1. Entender o módulo afetado.
2. Verificar schemas existentes.
3. Verificar tipos existentes.
4. Verificar rotas existentes.
5. Evitar duplicar lógica.
6. Criar ou atualizar migration se alterar banco.
7. Atualizar service.
8. Atualizar controller.
9. Atualizar frontend se necessário.
10. Testar fluxo completo.

## Ordem de implementação do MVP

1. Setup do projeto
2. Docker Compose
3. PostgreSQL
4. Drizzle
5. Better Auth
6. Usuários
7. Clientes
8. Diagnóstico 360°
9. Score
10. Dashboard
11. Plano de ação
12. IA
13. Relatórios
14. CRM
15. Meta Ads
16. WhatsApp

## Regra para alterações grandes

Ao alterar algo grande, sempre informar:

- Arquivos alterados
- O que foi alterado
- Por que foi alterado
- Comandos que precisam ser rodados
- Próximo passo recomendado

## Não fazer

- Não alterar vários módulos sem necessidade.
- Não criar arquivos genéricos demais.
- Não criar código sem tipagem.
- Não ignorar erros de TypeScript.
- Não criar integração externa antes de criar abstração interna.
