const express = require('express')
const router = express.Router()
const pg = require('../db/database.js');


//con callback
router.get('/',(req,res)=>{
  pg.query('select * from usuario',(error,results) => {
    if(error){
      throw error
    }
    res.status(200).json(results.rows)
  })
})

//Registrar usuarios
router.post('/signup',(req,res) => {
  const {numero_celular,nombre,direccion,num_tarjetacredito,password} = req.body
  if(numero_celular == "" || nombre == "" || direccion == "" || num_tarjetacredito == null || password == ""){
    res.status(404).json({error:"Digite todos los campos"})
    return
  }
  const myquery = {
    text:'insert into usuario(numero_celular,nombre,direccion,num_tarjetacredito,password) values ($1,$2,$3,$4,$5)',
    values:[numero_celular,nombre,direccion,num_tarjetacredito,password]
  }
  pg.query(myquery)
          .then(dbres => {
            res.status(200).json({mensaje:'Usuario almacenado exitosamente'})
          })
          .catch(err => {
            console.log(err)
            res.status(404).json({error:err.detail})
          })
})

module.exports = router;
