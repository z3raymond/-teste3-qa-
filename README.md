# K6 API Performance Testing

Projeto de testes de performance para a API JSONPlaceholder usando K6.

## 🎯 Objetivo

Testar a performance da API JSONPlaceholder validando:
- Tempo de resposta
- Taxa de erro
- Estrutura dos dados retornados
- Throughput

## 🚀 Como executar

### Pré-requisitos
```bash
# Instalar K6
winget install k6
```

### Executar testes
```bash
# Teste básico
npm run test

# Teste de carga
npm run test:load

# Teste de stress
npm run test:stress
```

## 📊 Relatórios

Os relatórios são gerados automaticamente em:
- `reports/performance-report.json` - Dados completos
- `reports/summary-report.txt` - Resumo executivo

## 🏗️ Estrutura

```
├── config/
│   └── api-config.js      # Configurações centralizadas
├── tests/
│   └── api-performance.js # Script principal de testes
├── reports/               # Relatórios gerados
└── package.json          # Dependências e scripts
```

## 📈 Métricas Monitoradas

- **Response Time**: P95 < 500ms
- **Error Rate**: < 10%
- **Throughput**: > 10 req/s
