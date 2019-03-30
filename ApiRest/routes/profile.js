const express = require('express')
const router = express.Router()
const pg = require('../db/database.js');

//pedir los datos del perfil
router.get('/:phone',async (req,res) =>{
  const num_celular = req.params.phone
  const query = {
    text:'select numero_celular,nombre,direccion,num_tarjetacredito FROM usuario where numero_celular=$1',
    values:[num_celular]
  }
  try {
    const user = await pg.query(query)
    res.status(200).json(user.rows[0])
  } catch (e) {
    console.log(e);
  }
})

//actualizar los datos de un perfil
router.post('/updateprofile',async(req,res) => {
  const {numero_celular,nombre,direccion,num_tarjetacredito} = req.body
  if(numero_celular == "" || nombre == "" || direccion == "" || num_tarjetacredito == ""){
    res.status(400).json({
      msg:'Hay algun campo vacio'
    })
    return
  }else if(isNaN(num_tarjetacredito)){
    res.status(400).json({
      msg:'Num_tarjetacredito debe ser numerico'
    })
    return
  }
  const query = {
    text:'update usuario set nombre=$2,direccion=$3,num_tarjetacredito=$4 where numero_celular=$1',
    values:[numero_celular,nombre,direccion,num_tarjetacredito]
  }
  try {
    await pg.query(query)
    res.status(200).json({
      msg:'Perfil Actualizado'
    })
  } catch (e) {
    console.log(e);
  }
})


module.exports = router
