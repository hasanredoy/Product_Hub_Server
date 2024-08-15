const express = require('express');
const cors = require('cors');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT||5000
const app = express()

app.use(express.json())

app.use(cors())


app.use(cookieParser());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster2.snaxilo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollections = await client.db('Product_HubDB').collection("products")

    app.get("/products",async(req,res)=>{
      const result = await productCollections.find().toArray()
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',async(req,res)=>{
  res.send('product hub is running')
})

app.listen(port,()=>{
  console.log('product hub is running');
})