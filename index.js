const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = process.env.MONGODB_URI;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
      const db = client.db('RecipeHub');
    const recipeCollection = db.collection('recipe');
      const favoriteCollection = db.collection('favorite');
    const usersCollection = db.collection('user');
    const reportCollection = db.collection('report');
    const paymentCollection = db.collection('payments');

app.post('/recipes', async (req, res) => {
  try {
    const newRecipe = req.body;
    
    if (!newRecipe.name || !newRecipe.image) {
      return res.status(400).send({ message: "Recipe Name and Image are required" });
    }

    const result = await recipeCollection.insertOne(newRecipe);
    res.status(201).send(result);
  } catch (error) {
    console.error("Error inserting recipe:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});