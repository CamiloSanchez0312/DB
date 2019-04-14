--Proyecto final de Bases de Datos
-- docker run --name=postgis -d -e POSTGRES_USER=juancamilo -e POSTGRES_PASS=24880312 -e POSTGRES_DBNAME=gis  -p 5433:5432  --restart=always kartoza/postgis
-- AddGeometryColumn( <table_name>, <column_name>, <srid>, <type>, <dimension>).
--The type must be an uppercase string corresponding to the geometry type, eg, 'POLYGON' or 'MULTILINESTRING'.
--http://spatialreference.org/ref/epsg/3115/
DROP TABLE IF EXISTS Conductor CASCADE;
DROP TABLE IF EXISTS Vehiculo CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Servicio CASCADE;
DROP TABLE IF EXISTS Favorito CASCADE;

CREATE EXTENSION postgis;

CREATE TABLE Vehiculo(
  matricula varchar(6),
  marca varchar(15),
  modelo varchar(15),
  anio int,
  baul boolean,
  soat int,
  PRIMARY KEY (matricula)
);

CREATE TABLE Conductor(
  numero_celular bigint,
  nombre varchar(30) not null,
  estado boolean,
  calificacion_conductor float,
  num_tarjetacredito bigint not null,
  matricula varchar(6),
  password varchar(20),
  PRIMARY KEY (numero_celular),
  FOREIGN KEY (matricula) REFERENCES Vehiculo (matricula)
);
SELECT addgeometrycolumn('conductor','coordenadas',3115,'POINT',2);

CREATE TABLE Usuario(
  numero_celular bigint,
  nombre varchar(30) not null,
  direccion varchar(30),
  num_tarjetacredito bigint not null,
  password varchar(20),
  PRIMARY KEY (numero_celular)
);
--SELECT addgeometrycolumn('usuario','coordenadas',3115,'POINT',2);

CREATE TABLE Servicio(
  nro_servicio serial,
  numero_celular_cond bigint,
  numero_celular_user bigint,
  calificacion_servicio float,
  estado boolean,
  precio float,
  PRIMARY KEY (nro_servicio),
  FOREIGN KEY (numero_celular_cond) REFERENCES Conductor (numero_celular),
  FOREIGN KEY (numero_celular_user) REFERENCES Usuario (numero_celular)
);
SELECT addgeometrycolumn('servicio','coordenada_inicio',3115,'POINT',2);
SELECT addgeometrycolumn('servicio','coordenada_destino',3115,'POINT',2);

CREATE TABLE Favorito(
  numero_celular bigint,
  num_favorito serial,
  nombre varchar(20) not null,
  PRIMARY KEY (numero_celular,num_favorito),
  FOREIGN KEY (numero_celular) REFERENCES Usuario (numero_celular)
);
SELECT addgeometrycolumn('favorito','coordenadas',3115,'POINT',2) ;

INSERT INTO Vehiculo VALUES ('FGE289','Chevrolet','Spark GT',2017,'true',1234);
INSERT INTO Vehiculo VALUES ('FKH123','Nissan','March',2018,'false',8759);
INSERT INTO Vehiculo VALUES ('CFU635','Nissan','Pathfinder',2015,'true',5485);
INSERT INTO Vehiculo VALUES ('KKK111','Ford','Fiesta',2018,'true',5448);

INSERT INTO Conductor(numero_celular,nombre,estado,calificacion_conductor,num_tarjetacredito,matricula,coordenadas) VALUES (317872,'Camilo Sanchez','true',null,47554,'CFU635',st_geomfromtext('POINT(3.5182 -76.5373)',3115));
INSERT INTO Conductor(numero_celular,nombre,estado,calificacion_conductor,num_tarjetacredito,matricula,coordenadas) VALUES (332157,'Santiago Rodriguez','false',null,145357,'FGE289',st_geomfromtext('POINT(3.4197 -76.4804)',3115));
INSERT INTO Conductor(numero_celular,nombre,estado,calificacion_conductor,num_tarjetacredito,matricula,coordenadas) VALUES (316875,'Julian Salgado','false',null,357855,'FKH123',st_geomfromtext('POINT(3.4147 -76.5623)',3115));
INSERT INTO Conductor(numero_celular,nombre,estado,calificacion_conductor,num_tarjetacredito,matricula,coordenadas) VALUES (315632,'Jesica Sanchez','true',null,5215,'KKK111',st_geomfromtext('POINT(3.4150 -76.4555)',3115));


INSERT INTO Usuario(numero_celular,nombre,direccion,num_tarjetacredito,password) VALUES (318569,'Karol Sanchez','Cra 12',45369,'1234');
INSERT INTO Usuario(numero_celular,nombre,direccion,num_tarjetacredito,password) VALUES (318754,'Jose Mosquera','Cra 25',96836,'1234');
INSERT INTO Usuario(numero_celular,nombre,direccion,num_tarjetacredito,password) VALUES (312467,'Camilo Zamudio','Calle 12',77889,'1234');

INSERT INTO Favorito(numero_celular,nombre,coordenadas) VALUES (318569,'Univalle',st_geomfromtext('POINT(3.4947 -76.5442)',3115));
INSERT INTO Favorito(numero_celular,nombre,coordenadas) VALUES (318754,'Casa',st_geomfromtext('POINT(3.5381 -76.5280)',3115));
INSERT INTO Favorito(numero_celular,nombre,coordenadas) VALUES (312467,'La topa',st_geomfromtext('POINT(3.4400 -76.4962)',3115));

--VISTAS
--vistaConductores: Posicion, nombre y celular de los conductores que estan disponibles para desplegarlos en
--el mapa de los clientes
DROP VIEW IF EXISTS vistaConductores;
CREATE VIEW vistaConductores as SELECT numero_celular,nombre,calificacion_conductor,(select ST_AsGeoJSON(coordenadas)::json) as coor FROM Conductor where estado='true';

--Funciones almacenadas
--Busca el taxi mas cercano a la ubicacion del lugar de inicio del viaje
CREATE OR REPLACE FUNCTION viaje(float,float) RETURNS table(nom varchar,num bigint,dis float) AS $$
  DECLARE
    latOr ALIAS FOR $1;
    lngOr ALIAS FOR $2;
    latDes ALIAS FOR $3;
    lngDes ALIAS FOR $4;
  BEGIN
    return query SELECT nombre,numero_celular,111.195*ST_Distance(coordenadas,ST_SetSRID(ST_MakePoint(latOr, lngOr), 3115)) AS distancia
    FROM conductor WHERE estado=true ORDER BY distancia LIMIT 1;
  END;
$$ LANGUAGE plpgsql VOLATILE;
--https://stackoverflow.com/questions/46926283/convert-st-distance-result-to-kilometers-or-meters/46926842 => convertir a metros
--calcula la distancia de un punto a otro
CREATE OR REPLACE FUNCTION calculaDistanciaViaje(float,float,float,float) RETURNS float AS $$
  DECLARE
    latOr ALIAS FOR $1;
    lngOR ALIAS FOR $2;
    latDes ALIAS FOR $3;
    lngDes ALIAS FOR $4;
  BEGIN
    return ST_DISTANCE(ST_SetSRID(ST_MakePoint(latOr, lngOR), 3115),ST_SetSRID(ST_MakePoint(latOr, lngDes), 3115));
  END;
$$ LANGUAGE plpgsql;
--calcula la calificacion total de un conductor
CREATE OR REPLACE FUNCTION calculaCalificacion(bigint) RETURNS float AS $$
  DECLARE
    num_cel_cond ALIAS FOR $1;
  BEGIN
    return SELECT CAST (AVG(calificacion_servicio) AS FLOAT) as calificacion FROM servicio WHERE numero_celular_cond=num_cel_cond;
  END;
$$ LANGUAGE plpgsql VOLATILE;
