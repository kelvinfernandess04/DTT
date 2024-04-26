#!/bin/bash
set -m
/opt/mssql/bin/permissions_check.sh /opt/mssql/bin/sqlservr &
sleep 30
SQL_SERVER_PID=$( ps -C sqlservr -o pid= | awk 'NR==2 { printf $1 }' )
ps -aux
echo "server pid: ${SQL_SERVER_PID}"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Kelvin 2004' -i /docker-entrypoint-initdb.d/init.sql
echo "scriptfinalizado"
#fg $SQL_SERVER_PID
jobs -l
fg %1