const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zx1pf4.mongodb.net/?retryWrites=true&w=majority`;

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


    const serviceCollection = client.db('car-doctor').collection('services')
    const dataCollection = client.db('car-doctor').collection('data')


    // get service
    app.get('/services', async(req, res)=>{
        const result = await serviceCollection.find().toArray();
        res.send(result);
    })

    // get single data
    app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const options = {
            projection: {
                img: 1,
                description: 1
            }
        }
        const result = await serviceCollection.findOne(query, options);
        res.send(result)
    })


    // post submit data
    app.post('/data', async(req, res)=>{
      const newItem = req.body;
      const result = await dataCollection.insertOne(newItem);
      res.send(result);
    })


    // get some data
    app.get('/data', async(req, res)=>{
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await dataCollection.find(query).toArray();
      res.send(result);
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



app.get('/', (req, res)=>{
    res.send('Nabila is coming')
})

app.listen(port, ()=>{
    console.log(`Nabila is Comming ${port}`)
})