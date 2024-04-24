FROM node:21.7.3

WORKDIR /app

COPY package.json package-lock.json ./

# Defina a variável de ambiente da senha do SQL Server
ENV MSSQL_SA_PASSWORD=${MSSQL_PASSWORD}

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
