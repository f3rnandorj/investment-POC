# investo-challenge

Requisitos Funcionais (RFs)
Consulta de Ativos Disponíveis para Simulação
[X] -  O sistema deve disponibilizar um endpoint para consulta de ativos disponíveis.
[X] -  A resposta deve conter, no mínimo, os campos: codigoAtivo, classe e etiqueta.

Consulta de Rentabilidade de Índice Dia a Dia
[] -  O sistema deve fornecer um endpoint que receba o ticker de um ativo e retorne a rentabilidade diária.
[] -  O retorno deve conter dados suficientes para a construção de um gráfico de rentabilidade.
[X] - Feriados e finais de semana não precisam ser pontos no gráfico, o mais comum é simplesmente ocultá-los e/ou ignorá-los


Cálculo da Rentabilidade da Carteira Dia a Dia
[] -  O sistema deve fornecer um endpoint que receba uma lista de ativos (tickers) e seus respectivos pesos.
[] -  O endpoint deve retornar a rentabilidade diária da carteira, permitindo a construção de gráficos.

Filtro de Rentabilidade por Período
[] -  Todos os endpoints de rentabilidade devem permitir a filtragem por um intervalo de datas (inicial e final).
[] -  O sistema deve considerar apenas dias úteis no cálculo.

Simulação de Rentabilidade Baseada em Composição, Datas e Valor
[] -  O sistema deve permitir a simulação de rentabilidade com base na composição da carteira, intervalo de datas e valor inicial.
[] -  O retorno deve conter os valores necessários para a construção de gráficos de rentabilidade ao longo do tempo.


Requisitos Não Funcionais (RNFs)
Segurança
[] - Os dados sensíveis devem ser protegidos por criptografia e outras medidas de segurança.

Tratamento de Erros e Logs
[] -  O sistema deve retornar mensagens de erro amigáveis e informativas.
[] -  Deve haver um sistema de log para monitoramento de falhas e análise de performance.

⚙ Requisitos Operacionais (ROs)
Banco de Dados
[X] -  PostgreSQL rodando em um container Docker.

Ferramentas de Desenvolvimento
[X] -  Prisma ORM para manipulação de banco de dados.
[X] -  Node.js e TypeScript para desenvolvimento da API.

Ambiente de Execução
[X] -  A aplicação deve rodar via Docker Compose para facilitar o gerenciamento dos containers.
