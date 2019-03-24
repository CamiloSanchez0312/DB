//const express = require('express')
const router = require('express-promise-router')()
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
  //primero validamos que los campos no sean vacios
  if(numero_celular=="" || password == ""){
    res.json({
      msg:'Hay algun campo vacio'
    })
  }
  const query = {
    text:'SELECT numero_celular,password FROM usuario where numero_celular=$1',
    values:[numero_celular]
  }
  try{
    const user = await pg.query(query)
    const userExistent = user.rows[0]
    if(user.rows.length == 0){
      res.json({msg:'No existe el usuario'})
    }else{
      if(password == user.rows[0].password){
        const token = jwt.sign({ userExistent }, 'my_secret_key')
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

//Registrar usuario
router.post('/signup',async(req,res) => {
  const {numero_celular,nombre,direccion,num_tarjetacredito,password} = req.body
  if(numero_celular == "" || nombre == "" || direccion == "" || num_tarjetacredito == null || password == ""){
    res.status(404).json({error:"Digite todos los campos"})
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
            res.status(200).json({mensaje:'Usuario almacenado exitosamente'})
          })
          .catch(err => {
            console.log(err)
            res.status(404).json({error:err.detail})
          })
})

module.exports = router;
