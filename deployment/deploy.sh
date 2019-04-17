#!/bin/bash

echo "starting the database"
docker run --name=postgis -d -e POSTGRES_USER=juancamilo -e POSTGRES_PASS=24880312 -e POSTGRES_DBNAME=taxi -p 5433:5432 --restart=always kartoza/postgis
echo "intantiating .sql"
docker cp database.sql postgis:/database.sql
docker exec postgis su - postgres -c "psql taxi -f ${SQLDIR}/database.sql" || true
echo "iniciando el ApiRestFull api"
docker run --rm -it -d --link=postgis:database --name api santiagorp7/apirest:1
echo "iniciando el servidor frontend" 
docker run --rm -it -d --link=api:apirest --name frontend santiagorp7/front -p 8080:8080
