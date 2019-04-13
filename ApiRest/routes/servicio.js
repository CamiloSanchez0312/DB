const express = require('express')
const router = express.Router()
const pg = require('../db/database.js');

//buscar taxis mas cercano disponible
router.post('/',async(req,res) => {
  const {lat,lng} = req.body
  const query = {
    text:'SELECT * FROM viaje($1,$2) NATURAL JOIN vehiculo',
    values:[lat,lng]
  }
  try{
    const respuesta = await pg.query(query)
    console.log(respuesta.rows[0]);
    res.status(200).json(respuesta.rows[0])
  } catch (e) {
    console.log(e);
    res.sendStatus(400)
  }
})
//st_setsrid(st_makepoint($3, $4),3115)
//se ejecuta cuando el usuario acepta el servicio
router.post('/acepta',async(req,res) => {
  const {numero_celular_cond,numero_celular_user,coordenada_inicio,coordenada_destino} = req.body
  const latInicio = coordenada_inicio[0]
  const longInicio = coordenada_inicio[1]
  const latDestino = coordenada_destino[0]
  const longDestino = coordenada_destino[0]
  console.log(coordenada_inicio);
  const query = {
    text:'INSERT INTO servicio(numero_celular_cond,numero_celular_user,coordenada_inicio,coordenada_destino) VALUES ($1,$2,st_setsrid(st_makepoint($3, $4),3115),st_setsrid(st_makepoint($5, $6),3115))',
    values:[numero_celular_cond,numero_celular_user,latInicio,longInicio,latDestino,longDestino]
  }
  try{
    await pg.query(query)
    console.log('SERVICE STARTED');
    res.status(200).json({msg:'Servicio Iniciado'})
  } catch (e) {
    console.log(e);
    res.sendStatus(400)
  }
})


module.exports = router
