const express = require('express')
const router = express.Router()
const pg = require('../db/database.js');

router.get('/',(req,res)=>{
  pg.query('select * from conductor')
  .then(dbres => {
    res.status(200).json(dbres.rows)
  })
  .catch(err => {
    console.log(err)
  })
})
//Registrar conductores
router.post('/signup',(req,res) => {
  const {numero_celular,nombre,direccion,num_tarjetacredito,password} = req.body
  if(numero_celular == null || nombre == null || direccion == null || num_tarjetacredito == null || password == null){
    res.status(404).json({error:"Digite todos los campos"})
    return
  }
  const myquery = {
    text:'insert into conductor(numero_celular,nombre,direccion,num_tarjetacredito,password) values ($1,$2,$3,$4,$5)',
    values:[numero_celular,nombre,direccion,num_tarjetacredito,password]
  }
  pg.query(myquery)
          .then(dbres => {
            res.status(200).json({mensaje:'Conductor almacenado exitosamente'})
          })
          .catch(err => {
            res.status(404).json({error:err.detail})
          })
})

module.exports = router
