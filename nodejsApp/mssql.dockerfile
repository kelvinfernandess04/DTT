# Use a imagem oficial do SQL Server para Docker
FROM mcr.microsoft.com/mssql/server:2019-latest

# Defina a variável de ambiente da senha do SQL Server
ENV MSSQL_SA_PASSWORD="Kelvin 2004"
RUN echo $MSSQL_PASSWORD
RUN echo $MSSQL_SA_PASSWORD
# Defina a variável de ambiente ACCEPT_EULA como "Y" para aceitar o contrato de licença do SQL Server
# ENV ACCEPT_EULA=Y

# Defina a variável de ambiente MSSQL_PID como "Express" para usar a edição Express do SQL Server
ENV MSSQL_PID=Express

# Copie o script de inicialização SQL para o contêiner
COPY init.sql /docker-entrypoint-initdb.d/
COPY startDocker.sh /docker-entrypoint-initdb.d/
#RUN chmod +x /docker-entrypoint-initdb.d/startDocker.sh
ENTRYPOINT [ "/docker-entrypoint-initdb.d/startDocker.sh" ]
#ENTRYPOINT [ "/opt/mssql/bin/permissions_check.sh" ]
#CMD [ "/opt/mssql/bin/sqlservr" ]
#CMD ["/opt/mssql/bin/sqlservr", "&&", "/opt/mssql-tools/bin/sqlcmd","-S", "localhost", "-U", "SA", "-P", "'Kelvin 2004'","-i", "/docker-entrypoint-initdb.d/init.sql"]
# Exponha a porta padrão do SQL Server
EXPOSE 1433

#É necessário executar o seguinte commando:
#/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Kelvin 2004' -i /docker-entrypoint-initdb.d/init.sql