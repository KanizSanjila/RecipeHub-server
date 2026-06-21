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

    console.log(" Backend received data successfully:", newRecipe);
    
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

app.get('/recipes', async (req, res) => {
  try {
  const result = await recipeCollection
      .find() 
      .limit(4)           
      .toArray();
    
    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});


app.get('/all-recipes', async (req, res) => {
  try {
    const result = await recipeCollection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.patch('/recipes/:id/like', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updateDoc = { $inc: { likesCount: 1 } };
  const result = await recipeCollection.updateOne(query, updateDoc);
  res.send(result);
});

app.post('/favorites', async (req, res) => {
  const favoriteItem = req.body; // { userEmail: "...", recipeId: "...", recipeName: "..." }
  const result = await favoritesCollection.insertOne(favoriteItem);
  res.send(result);
});

app.post('/reports', async (req, res) => {
  const reportData = req.body; // { recipeId: "...", userEmail: "...", reason: "..." }
  const result = await reportsCollection.insertOne(reportData);
  res.status(201).send(result);
});

const { ObjectId } = require('mongodb');

app.get('/my-recipes', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    const query = { authorEmail: email };
    const result = await recipeCollection.find(query).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

app.put('/recipes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedRecipe = req.body; 
    
    const updateDoc = {
      $set: {
        recipeName: updatedRecipe.recipeName,
        recipeImage: updatedRecipe.recipeImage,
        category: updatedRecipe.category,
        cuisineType: updatedRecipe.cuisineType,
        difficultyLevel: updatedRecipe.difficultyLevel,
        preparationTime: updatedRecipe.preparationTime,
        ingredients: updatedRecipe.ingredients,
        instructions: updatedRecipe.instructions,
        updatedAt: new Date()
      },
    };

    const result = await recipeCollection.updateOne(filter, updateDoc);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update recipe" });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await recipeCollection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete recipe" });
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