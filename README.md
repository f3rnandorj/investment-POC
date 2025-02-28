# Configuração de Ambiente

## Instalar o docker

https://www.docker.com/

## Clonando repositorio e navegando para o projeto
```shell script
git clone https://github.com/f3rnandorj/investo-challenge && cd ..
```

## Instalar dependências de desenvolvimento
```shell script
yarn
```

# Iniciar Backend

Inicialize o docker manualmente ou rode

Windows
```shell script
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```
MacOS
```shell script
open /Applications/Docker.app
```

OBS: O sucesso dos comandos acima depende da localização do docker na sua maquina, caso não consiga executa-los abra-o manualmente.

## Criando .env
```shell script
cp .env.example .env
```
## OBS: Após criar .env preencher com as chaves necessarias

Todas as etapas para criar o backend estão reunidas em um único comando:

```shell script
yarn start:backend
```

O comando acima é um atalho para realizar as seguintes tarefas:

```shell script
# Command 1: Build Docker containers
docker compose up --build -d

# Command 2: Initializing prisma and run migrations
npx prisma generate
npx prisma migrate dev

# Command 3: Run script to insert file's data into DB
npx ts-node src/scripts/importData.ts
```

# Fluxo manual (alternativo)

## Criando e subindo o container no docker
```shell script
docker compose up --build -d
```

## Gerando interfaces do prisma com base no schema
```shell script
npx prisma generate
```

## Rodando as migrations pelo prisma
```shell script
npx prisma migrate dev
```

## Rodando script de insersão de dados no banco
```shell script
yarn seeds
```

Abra o Docker Dashboard para verificar se todos os containers foram criados.
![image](https://github.com/user-attachments/assets/9af2966a-32a5-410b-984d-a05b99dea90a)

---

## Inicializando o backend
```shell script
yarn start:dev
```

**Pronto! A API está pronta para ser utilizada! 🥳**

Aplicações | URL | User | Password
--- | --- | --- | ---
App - NodeJs | <http://localhost:3333> | - | -
Documentação - Swagger | <http://localhost:3333/docs> | - | -
Postgres - investodb | <http://localhost:5432> | admin | password

---

### Tecnologias Utilizada

- [Docker][l-docker]
- [NodeJs v20.12.2][l-nodejs]
- [Prisma][l-prisma]
- [Postgres][l-postgres]

[l-docker]: https://www.docker.com
[l-nodejs]: https://nodejs.org
[l-prisma]: https://www.prisma.io
[l-postgres]: https://hub.docker.com/_/postgres
