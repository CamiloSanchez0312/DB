# Proyecto final Bases de Datos
Aqui Va consignado como correr el proyecto

# Routes
<ul><li>  y aqui las rutas de peticones y sus tipos </li></ul>
<h1> Herramientas Tecnologicas Usadas: </h1>
<ul> 
  <li> <a href="https://www.postgresql.org/">Postgresql</a></li>
  <li> <a href="https://www.docker.com/">Docker</a></li>
  <li> <a href="https://nodejs.org/en/">Nodejs</a> </li>
  <li> <a href="https://vuejs.org">Vuejs</a>(framework de nodejs y complementos)</li>
  <li> <a href="https://expressjs.com/es/">Expressjs</a>(api)</li>
</ul>

# Despliegue
listado de requisitos:
  <ul>
  <li> Sistema basado en Unix/linux (por el momento)</li>
  <li>Conexion a internet</li>
  <li>Docker instalado(guia a la documentacion abajo)</li>
  </ul>
  <p>
 Para el despliegue de la aplicacion en contenedores es necesario tener docker instalado
 puedes conocer mas de sobre docker y su instalacion en este <a href="https://docs.docker.com/get-started/">link</a> a la documentacion </p>
<p>Basta con descargar la carpeta <a href="https://github.com/CamiloSanchez0312/DB/tree/master/deployment">deployment</a> que contiene el acrhivo <a href="https://github.com/CamiloSanchez0312/DB/blob/master/deployment/deploy.sh">deploy.sh</a> y <a href="https://github.com/CamiloSanchez0312/DB/blob/master/deployment/database.sql">database.sql</a> es importante manterner estos archivos en el mismo directorio y al mismo nivel para la carga de el archivo en la base de datos postresql</p>
<p>correr <a href="https://github.com/CamiloSanchez0312/DB/blob/master/deployment/deploy.sh">deploy.sh</a> ej: ./deploy.sh <p> <p>para visualizar la ejecucion basta con entrar en <a href="http://localhost:8080">localhost</a><p>
