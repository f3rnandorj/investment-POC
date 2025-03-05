const walletPriceHistory = {
  tags: ["Assets"],
  description: "Retorna o histórico de rendimento diário de uma carteira contendo múltiplos ativos.",
  summary: "Histórico de preços da carteira",
  body: {
    type: "object",
    properties: {
      assets: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ticker: { type: "string", description: "Código do ativo (ticker) a ser consultado" },
            weight: { type: "string", description: "Peso do ativo na carteira" }
          },
          required: ["ticker", "weight"]
        },
        minItems: 1,
        description: "Lista de ativos da carteira, com pelo menos um ativo"
      },
      startDate: { type: "string", description: "Data de início no formato DD/MM/AAAA", nullable: true },
      endDate: { type: "string", description: "Data de fim no formato DD/MM/AAAA", nullable: true }
    },
    required: ["assets"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        portfolioProfitability: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string", format: "date-time" },
              profitabilityDay: { type: "number" }
            }
          }
        },
        cdiProfitability: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string", format: "date-time" },
              profitabilityDay: { type: "number" }
            }
          }
        }
      }
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "A soma dos pesos não é igual a 100%. ||  O intervalo de datas deve ser de pelo menos dois dias." }
      }
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Ativo não encontrado" }
      }
    }
  }
};

const simulateInvestment = {
  tags: ["Assets"],
  description: "Simula o retorno de um investimento com base no montante inicial, ativo escolhido (ticker) e período de tempo definido.",
  summary: "Simulação de investimento",
  querystring: {
    type: "object",
    properties: {
      ticker: { type: "string", description: "Código do ativo (ticker) a ser consultado", minLength: 1 },
      startDate: { type: "string", description: "Data de início no formato DD/MM/AAAA" },
      endDate: { type: "string", description: "Data de fim no formato DD/MM/AAAA" },
      investment: { type: "string", description: "Montante inicial investido" }
    },
    required: ["ticker", "startDate", "endDate", "investment"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        initialInvestment: { type: "number", description: "Valor inicial investido" },
        simulationReturn: { type: "number", description: "Valor final da simulação do investimento" },
        daysAmount: { type: "number", description: "Quantidade de dias da simulação" }
      }
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Ativo não encontrado" }
      }
    }
  }
};

const priceHistory = {
  tags: ["Assets"],
  description: "Obtém a rentabilidade diária de um ativo específico com base no ticker informado, comparando com a rentabilidade do CDI.",
  summary: "Histórico de rentabilidade de um ativo",
  querystring: {
    type: "object",
    properties: {
      ticker: { type: "string", description: "Código do ativo (ticker) a ser consultado" },
      startDate: { type: "string", description: "Data de início no formato DD/MM/AAAA" },
      endDate: { type: "string", description: "Data de fim no formato DD/MM/AAAA" }
    },
    required: ["ticker"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        tickerProfitability: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string", format: "date-time" },
              profitabilityDay: { type: "number" }
            }
          }
        },
        cdiProfitability: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string", format: "date-time" },
              profitabilityDay: { type: "number" }
            }
          }
        }
      }
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "O intervalo de datas deve ser de pelo menos dois dias." }
      }
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Ativo não encontrado" }
      }
    }
  }
};

export const assetSwaggerSchemas = {
  walletPriceHistory,
  simulateInvestment,
  priceHistory
};