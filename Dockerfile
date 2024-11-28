# syntax = docker/dockerfile:1

# Ajuste a versão do Node.js conforme desejado
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Diretório onde o app vai viver
WORKDIR /app

# Definir ambiente como produção
ENV NODE_ENV="production"

# Estágio de build para reduzir o tamanho final da imagem
FROM base as build

# Instalar pacotes necessários para build dos módulos Node
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copiar os arquivos de dependências
COPY package-lock.json package.json ./ 

# Instalar as dependências do projeto
RUN npm ci

# Copiar o código do aplicativo
COPY . .

# Estágio final da imagem com a aplicação pronta para produção
FROM base

# Copiar os arquivos gerados na etapa de build para a imagem final
COPY --from=build /app /app

# Expor a porta para acesso (a porta que seu app escuta)
EXPOSE 3000

# Comando para rodar o app em produção
CMD [ "npm", "run", "start" ]


