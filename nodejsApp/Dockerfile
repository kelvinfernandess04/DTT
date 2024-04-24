FROM node:21.7.3

ENV MSSQL_PASSWORD="Kelvin 2004"


WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

# Copie o diretório público para o container
COPY public /app/public

# Exponha a porta 3000 para o front-end
EXPOSE 3000

# Defina o comando de entrada para iniciar o servidor Node.js
CMD ["node", "index.js"]
