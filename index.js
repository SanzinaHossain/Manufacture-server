const express = require('express')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const cors=require('cors')
const jwt=require('jsonwebtoken');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
//middle wire for cors
app.use(cors())
app.use(express.json())
//token verify
function verifyJWT(req,res,next){
    const authHeader=req.headers.authorization;
    if(!authHeader)
    {
      return res.status(401).send({message:'Unauthorized access'});
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err,decoded){
      if(err){
        return res.status(403).send({message:'Forbidden access'});
      }
      req.decoded=decoded;
      next()
    })
 }
//database Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uaiijlk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
          await client.connect();
          const toolsCollection=client.db('assignment-12').collection('tools');
          const userCollection=client.db('assignment-12').collection('users');
          const reviewCollection=client.db('assignment-12').collection('reviews');
          console.log("connected");


          //add review
          app.post('/reviews',async(req,res)=>{
            const reviews=req.body;
            const result=await reviewCollection.insertOne(reviews);
            res.send(result);
          })
          //add tools
          app.post('/tools',async(req,res)=>{
            const tools=req.body;
            const result=await toolsCollection.insertOne(tools);
            res.send(result);
          })
          //get all data from reviews
          app.get('/reviews',async(req,res)=>{
            const query={};
            const cursor=reviewCollection.find(query);
            const reviews=await cursor.toArray()
            res.send(reviews)
          })
          //get all tools data from database
          app.get('/tools',async(req,res)=>{
            const query={};
            const cursor=toolsCollection.find(query);
            const tools=await cursor.toArray()
            res.send(tools)
          })
          //collect a tools using particular id
          app.get('/tools/:id',async(req,res)=>{ 
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const tool=await toolsCollection.findOne(query);
            res.send(tool);
        })
        //user token setup
        app.put('/user/:email',async(req,res)=>{
            const email=req.params.email;
            const user=req.body;
            const filter={email:email}
            const options={upsert:true}
            const updateDoc={
              $set:user,
            };
            const result=await userCollection.updateOne(filter,updateDoc,options);
            const token=jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
            res.send({result,token});
          })
          //get all users
          app.get('/users',verifyJWT,async(req,res)=>{
            const query={};
            const cursor=userCollection.find(query);
            const users=await cursor.toArray()
            res.send(users)
          })
          //find all admin
          app.get('/admin/:email',async(req,res)=>{
            const email=req.params.email;
            const user=await userCollection.findOne({email:email})
            const isadmin=user.role==='admin';
            res.send({admin:isadmin})
          })
          //make admin
          app.put('/users/admin/:email',verifyJWT,async(req,res)=>{
            const email=req.params.email;
            const requester=req.decoded.email;
            console.log(requester);
            const requesterAccount=await userCollection.findOne({email:requester})
            if(requesterAccount.role==='admin')
            {
              const filter={email:email}
              const updateDoc={
                $set:{role:'admin'},
              };
              const result= await userCollection.updateOne(filter,updateDoc);
              res.send(result);
            }
            else{
              res.status(403).send({message:'forbidden access'});
            }
          })
         
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
  