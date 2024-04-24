# Use a imagem oficial do SQL Server para Docker
FROM mcr.microsoft.com/mssql/server:2019-latest

# Defina a variável de ambiente da senha do SQL Server
ENV MSSQL_SA_PASSWORD=${MSSQL_PASSWORD}

# Defina a variável de ambiente ACCEPT_EULA como "Y" para aceitar o contrato de licença do SQL Server
ENV ACCEPT_EULA=Y

# Defina a variável de ambiente MSSQL_PID como "Express" para usar a edição Express do SQL Server
ENV MSSQL_PID=Express

# Copie o script de inicialização SQL para o contêiner
COPY init.sql /docker-entrypoint-initdb.d/

# Exponha a porta padrão do SQL Server
EXPOSE 1433