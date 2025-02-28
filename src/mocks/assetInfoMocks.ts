import { Prisma } from "@prisma/client";

const assetInfosToCreate: Prisma.AssetInfoCreateInput[] = [
  {
    asset_code: "PETR4",
    name: "Petrobras",
    description: "Ações da Petrobras, empresa brasileira de petróleo.",
    category: "Ações",
    tag: "Energia",
    type: "Ordinária",
    subtype: "Petróleo",
    bovespa_name: "PETR4.SA",
  },
  {
    asset_code: "ITUB4",
    name: "Itaú Unibanco",
    description: "Ações do Itaú Unibanco, um dos maiores bancos do Brasil.",
    category: "Ações",
    tag: "Financeiro",
    type: "Preferencial",
    subtype: "Bancos",
    bovespa_name: "ITUB4.SA",
  },
  {
    asset_code: "ALZR11",
    name: "Alianza Trust Renda Imobiliária",
    description: "Fundo imobiliário focado em imóveis comerciais.",
    category: "Fundos Imobiliários",
    tag: "Imóveis",
    type: "FII",
    subtype: "Lajes Corporativas",
    bovespa_name: "ALZR11.SA",
  },
];

export const assetInfoMocks = {
  assetInfosToCreate,
};
