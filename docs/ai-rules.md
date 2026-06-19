# Regras para Módulo de IA

A IA deve interpretar dados do sistema, não inventar dados.

## Entradas permitidas

- Dados do diagnóstico
- Scores por área
- Comentários do consultor
- Histórico do cliente
- Dados do CRM
- Dados de campanhas
- Conversões

## Saídas esperadas

- Resumo executivo
- Principal gargalo
- Causa provável
- Recomendações
- Plano de ação sugerido
- Riscos
- Próximos passos

## Regra crítica

A IA não deve calcular números financeiros sozinha.

O backend calcula números.

A IA interpreta os números.

## Formato preferencial

Sempre que possível, solicitar saída em JSON estruturado.

Exemplo:

```json
{
  "executiveSummary": "",
  "mainBottleneck": "",
  "secondPriority": "",
  "probableCause": "",
  "recommendations": [],
  "suggestedActionPlans": []
}
```

## Revisão humana

Toda saída da IA deve ser revisada pelo consultor antes de ser usada em relatório final.
