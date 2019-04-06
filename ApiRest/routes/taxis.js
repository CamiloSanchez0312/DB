const express = require('express')
const router = express.Router()
const pg = require('../db/database.js');


//taxis que estan disponibles
router.get('/',async(req,res) => {
  const query = 'select * from vistaConductores'
  try {
    const taxis = await pg.query(query)
    console.log(taxis.rows);
    res.status(200).json(taxis.rows)
  } catch (e) {
    res.sendStatus(400)
  }
})
module.exports = router;
