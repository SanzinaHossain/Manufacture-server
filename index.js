const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors')
const jwt=require('jsonwebtoken');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
//middle wire for cors
app.use(cors())
app.use(express.json())
//database Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uaiijlk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
          await client.connect();
          const toolsCollection=client.db('assignment-12').collection('tools');
          console.log("connected");
 
          
         
          
          
    }
    finally{
 
    }
  }
  run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('assignment-12')
  })
  
  app.listen(port, () => {
    console.log(` assignment-12 ${port}`)
  })
  