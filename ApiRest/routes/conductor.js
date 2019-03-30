const express = require('express')
const router = express.Router()
//onst router = require('express-promise-router')()
const pg = require('../db/database.js');

router.get('/',async (req,res)=>{
  const driver = await pg.query('SELECT * FROM Conductor')
  res.status(200).json(driver.rows)
})

//login
router.post('/login',async(req,res)=>{
  const {numero_celular,password} = req.body
  //primero validamos que los campos no sean vacios
  if(numero_celular=="" || password == ""){
    res.json({
      msg:'Hay algun campo vacio'
    })
    return
  }
  const query = {
    text:'SELECT numero_celular,password FROM conductor where numero_celular=$1',
    values:[numero_celular]
  }
  try{
    const driver = await pg.query(query)
    const driverExistent = driver.rows[0]
    if(user.rows.length == 0){
      res.json({msg:'No existe el usuario'})
    }else{
      if(password == driver.rows[0].password){
        const token = jwt.sign({ driverExistent }, 'my_secret_key')
        res.json({
          msg:'Ingreso satisfactorio',
          token
        })
      }else{
        res.json({
          error:'Contrasena erronea'
        })
      }
    }
  }catch(err){
    console.log(err);
    res.status(500).json({
      msg:err
    })
  }

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
