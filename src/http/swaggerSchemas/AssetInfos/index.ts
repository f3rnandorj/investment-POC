const assetInfos = {
  tags: ["AssetInfo"],
  description: "Retorna informações sobre os ativos",
  summary: "Lista todas as informações dos ativos",
  response: { 
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          codigoAtivo: { type: "string" },
          classe: { type: "string" },
          etiqueta: { type: "string" }
        },
      }
    }
  }
};

export const assetInfoSwaggerSchemas = { assetInfos };