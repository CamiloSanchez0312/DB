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
  numero_celular int,
  nombre varchar(30) not null,
  estado boolean,
  calificacion_conductor float,
  num_tarjetacredito int not null,
  matricula varchar(6),
  password varchar(20),
  PRIMARY KEY (numero_celular),
  FOREIGN KEY (matricula) REFERENCES Vehiculo (matricula)
);
SELECT addgeometrycolumn('conductor','coordenadas',3115,'POINT',2);

CREATE TABLE Usuario(
  numero_celular int,
  nombre varchar(30) not null,
  direccion varchar(30),
  num_tarjetacredito int not null,
  password varchar(20),
  PRIMARY KEY (numero_celular)
);
SELECT addgeometrycolumn('usuario','coordenadas',3115,'POINT',2);

CREATE TABLE Servicio(
  nro_servicio serial,
  numero_celular_cond int,
  numero_celular_user int,
  calificacion_servicio float,
  PRIMARY KEY (nro_servicio),
  FOREIGN KEY (numero_celular_cond) REFERENCES Conductor (numero_celular),
  FOREIGN KEY (numero_celular_user) REFERENCES Usuario (numero_celular)
);
SELECT addgeometrycolumn('servicio','coordenada_inicio',3115,'POINT',2);
SELECT addgeometrycolumn('servicio','coordenada_destino',3115,'POINT',2);

CREATE TABLE Favorito(
  numero_celular int,
  num_favorito serial,
  nombre varchar(20) not null,
  PRIMARY KEY (numero_celular,num_favorito),
  FOREIGN KEY (numero_celular) REFERENCES Usuario (numero_celular)
);
SELECT addgeometrycolumn('favorito','coordenadas',3115,'POINT',2) ;

INSERT INTO Vehiculo VALUES ('FGE289','Chevrolet','Spark GT',2017,'true',1234);
INSERT INTO Vehiculo VALUES ('FKH123','Nissan','March',2018,'false',8759);
INSERT INTO Vehiculo VALUES ('CFU635','Nissan','Pathfinder',2015,'true',5485);

INSERT INTO Conductor(numero_celular,nombre,estado,calificacion_conductor,num_tarjetacredito,matricula,coordenadas) VALUES (317872,'Camilo Sanchez','false',null,47554,'CFU635',st_geomfromtext('POINT(3.5182 -76.5373)',3115));
INSERT INTO Conductor(numero_celular,nombre,estado,calificacion_conductor,num_tarjetacredito,matricula,coordenadas) VALUES (332157,'Santiago Rodriguez','false',null,145357,'FGE289',st_geomfromtext('POINT(3.4197 -76.4804)',3115));
INSERT INTO Conductor(numero_celular,nombre,estado,calificacion_conductor,num_tarjetacredito,matricula,coordenadas) VALUES (316875,'Julian Salgado','false',null,357855,'FKH123',st_geomfromtext('POINT(3.4147 -76.5623)',3115));

INSERT INTO Usuario(numero_celular,nombre,direccion,num_tarjetacredito,coordenadas) VALUES (318569,'Karol Sanchez','Cra 12',45369,st_geomfromtext('POINT(3.4357 -76.5375)',3115));
INSERT INTO Usuario(numero_celular,nombre,direccion,num_tarjetacredito,coordenadas) VALUES (318754,'Jose Mosquera','Cra 25',96836,st_geomfromtext('POINT(3.4934 -76.5725)',3115));
INSERT INTO Usuario(numero_celular,nombre,direccion,num_tarjetacredito,coordenadas) VALUES (312467,'Camilo Zamudio','Calle 12',77889,st_geomfromtext('POINT(3.5498 -76.5185)',3115));

INSERT INTO Favorito(numero_celular,nombre,coordenadas) VALUES (318569,'Univalle',st_geomfromtext('POINT(3.4947 -76.5442)',3115));
INSERT INTO Favorito(numero_celular,nombre,coordenadas) VALUES (318754,'Casa',st_geomfromtext('POINT(3.5381 -76.5280)',3115));
INSERT INTO Favorito(numero_celular,nombre,coordenadas) VALUES (312467,'La topa',st_geomfromtext('POINT(3.4400 -76.4962)',3115));
