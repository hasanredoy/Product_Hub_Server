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

    const productCollections = client.db('Product_HubDB').collection("products")

    const usersCollection = client.db('Product_HubDB').collection("users")


    // all  items routes 
    app.get("/products",async(req,res)=>{
      // get different values of queries 
      const size = parseInt(req.query.size)
      const page = parseInt(req.query.page)
      const brand = req.query?.brand
      const category = req.query?.category
      const minPrice = parseInt(req.query?.minPrice)
      const maxPrice = parseInt(req.query?.maxPrice)
      let query = {}
      if(brand) query.brand= brand
      if(brand) query.category= brand
      if(brand) query.brand= brand
      if(brand) query.brand= brand


      // get products
      const result = await productCollections.find().limit(size).skip(size*page).toArray()
      // send products to client 
      res.send(result)
    })
    // all  items count route 
    app.get("/products-count",async(req,res)=>{
      // get products count
      const count = await productCollections.estimatedDocumentCount()
      // send products to client 
      res.send({count})
    })

    // users collections routes 
    app.post("/users", async (req, res) => {
      const userData = req.body;

      const filter = { email: userData.email };
      const findUser = await usersCollection.findOne(filter);
      if (findUser) {
        return res.send({ message: "user Already Exist", insertedId: null });
      }

      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

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