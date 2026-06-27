# Regras para Modulo de IA

A IA deve interpretar dados do sistema, nao inventar dados.

## Entradas permitidas

- dados da baseline manual
- metricas manuais
- business events
- metricas historicas
- signals
- alerts
- action plans
- comentarios da organizacao

## Saidas esperadas

- resumo executivo
- principal gargalo
- segunda prioridade
- causa provavel
- recomendacoes
- plano de acao sugerido
- riscos
- proximos passos

## Regra critica

A IA nao deve calcular numeros financeiros sozinha.

O backend calcula numeros.

A IA interpreta os numeros.

## Formato preferencial

Sempre que possivel, solicitar saida em JSON estruturado.

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

## Revisao humana

Toda saida da IA deve ser revisada por um usuario responsavel antes de ser usada em relatorio final.
