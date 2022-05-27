const express = require('express')
const cors=require('cors')
const jwt=require('jsonwebtoken');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
//middle wire for cors
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('assignment-12')
  })
  
  app.listen(port, () => {
    console.log(`assignment-12 ${port}`)
  })
  