const express = require('express')
const router = express.Router()
//const router = require('express-promise-router')()
const pg = require('../db/database.js');
const jwt = require('jsonwebtoken');

//con callback
router.get('/',async (req,res)=>{
  const user = await pg.query('select * from usuario')
    res.status(200).json(user.rows)
})

//Login
router.post('/login',async(req,res)=>{
  const {numero_celular,password} = req.body
  console.log(req.body);
  console.log('num '+numero_celular+' pass '+password);
  //primero validamos que los campos no sean vacios
  if(numero_celular=="" || password == ""){
    res.json({
      msg:'Hay algun campo vacio'
    })
    return
  }
  console.log('isNan '+isNaN(numero_celular))
  if(isNaN(numero_celular)){
    res.json({msg:'Numero celular debe ser numerico'})
    return
  }
  const query = {
    text:'SELECT numero_celular,password FROM usuario where numero_celular=$1',
    values:[numero_celular]
  }
  try{
    const user = await pg.query(query)
    const userExistent = user.rows[0].numero_celular
    if(user.rows.length == 0){
      res.json({msg:'No existe el usuario'})
    }else{
      if(password == user.rows[0].password){
        const token = jwt.sign({ userExistent }, 'my_secret_key')
        //console.log('user '+userExistent);
        res.json({
          token
        })
      }else{
        res.json({
          msg:'Contrasena erronea'
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

//Registrar usuario
router.post('/signup',async(req,res) => {
  const {numero_celular,nombre,direccion,num_tarjetacredito,password} = req.body
  console.log(req.body);
  if(numero_celular == "" || nombre == "" || direccion == "" || num_tarjetacredito == "" || password == ""){
    res.json({msg:"Digite todos los campos"})
    return
  }
  const myquery = {
    text:'insert into usuario(numero_celular,nombre,direccion,num_tarjetacredito,password) values ($1,$2,$3,$4,$5)',
    values:[numero_celular,nombre,direccion,num_tarjetacredito,password]
  }
  /*
  const sign = await pg.query(myquery)
  res.status(200).json({mensaje:'Usuario almacenado exitosamente'})*/

  pg.query(myquery)
          .then(dbres => {
            res.status(200).json({msg:'Usuario almacenado exitosamente'})
          })
          .catch(err => {
            console.log(err)
            res.status(404).json({msg:err.detail})
          })
})

module.exports = router;
