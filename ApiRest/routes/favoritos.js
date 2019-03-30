const express = require('express')
const router = express.Router()
const pg = require('../db/database.js');

//obtener favoritos
router.get('/',async(req,res) =>{
  const query = ('select * from favorito')
  try {
    const fav = await pg.query(query)
    res.status(200).send(fav.rows)
  } catch (e) {
    console.log(e);
    res.sendStatus(400)
  }
})

//obtener los favoritos de un usuario especifico
router.get('/:phone', async(req,res) => {
  const numero_celular = req.params.phone
  const query = {
    text:'select * from favorito where numero_celular=$1',
    values:[numero_celular]
  }
  try {
    const fav = await pg.query(query)
    res.status(200).json(fav.rows)
  } catch (e) {
    console.log(e);
    res.sendStatus(400)
  }
})

//crear un lugar favorito
router.post('/create', async(req,res) => {
  const{numero_celular,nombre,lat,lon} = req.body
  if(numero_celular == "" || nombre == "" || lat == "" || lon == ""){
    res.status(400).json({
      msg:'Hay algun campo vacio'
    })
    return
  }
  const query = {
    text:'insert into favorito(numero_celular,nombre,coordenadas) values ($1,$2,st_setsrid(st_makepoint($3, $4),3115))',
    values:[numero_celular,nombre,lat,lon]
  }
  try {
    await pg.query(query)
    res.status(200).json({
      msg:'Favorito actualizado'
    })
  } catch (e) {
    res.sendStatus(400)
  }
})
//modificar un favorito ::::: falta buscar la forma de poder modificar tambien la ubicacion 
router.post('/update',async(req,res) => {
  const{numero_celular,nombre,lat,lon} = req.body
  if(numero_celular == "" || nombre == "" || lat == "" || lon == ""){
    res.status(400).json({
      msg:'Hay algun campo vacio'
    })
    return
  }
  const query = {
    text:'update favorito set nombre=$2  where numero_celular=$1',
    values:[numero_celular,nombre]
  }
  try {
      await pg.query(query)
      res.status(200).json({
        msg:'Favorito actualizado'
      })
  } catch (e) {
    console.log(e);
    res.sendStatus(400)
  }
})

module.exports = router
