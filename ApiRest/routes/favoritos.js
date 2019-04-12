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
    text:'select num_favorito,nombre,(select ST_AsGeoJSON(coordenadas)::json) as coor from favorito where numero_celular=$1',
    values:[numero_celular]
  }
  try {
    const fav = await pg.query(query)
    console.log(fav.rows);
    res.status(200).json(fav.rows)
  } catch (e) {
    console.log(e);
    res.sendStatus(400)
  }
})

//crear un lugar favorito
router.post('/', async(req,res) => {
  const{numero_celular,nombre,lat,lon} = req.body
  console.log(numero_celular+' '+nombre+' '+lat+' '+lon);
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
      msg:'Favorito Creado'
    })
  } catch (e) {
    res.sendStatus(400)
    console.log(e);
  }
})
//modificar un favorito
router.put('/',async(req,res) => {
  const{numero_celular,newNombre,id} = req.body
  if(numero_celular == "" || newNombre == "" || id == ""){
    res.status(400).json({
      msg:'Hay algun campo vacio'
    })
    return
  }
  const query = {
    text:'update favorito set nombre=$2  where numero_celular=$1 and num_favorito=$3',
    values:[numero_celular,newNombre,id]
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

router.delete('/:phone/:idFav',async(req,res) => {
  const query = {
    text:'DELETE FROM favorito WHERE numero_celular=$1 AND num_favorito=$2',
    values:[req.params.phone,req.params.idFav]
  }
  try {
    await pg.query(query)
    res.status(200).json({
      msg:'Favorito Eliminado'
    })
  } catch (e) {
    console.log(e);
    res.sendStatus(400)
  }
})

module.exports = router
