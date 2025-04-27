import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Pokemon from './models/Pokemon.js'; 
import pokemonRouter from './routes/pokemonRoutes.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static('assets'));
app.use('/api/pokemons', pokemonRouter);


// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/pokemons-db')
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(PORT, () => {
      console.log(`🔥 Serveur Express en ligne sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err);
  });

// Route API
app.get('/api/pokemons', async (req, res) => {
  try {
    const pokemons = await Pokemon.find(); // ← Lis tous les Pokémon de la collection
    res.json(pokemons);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Nouvelle route : récupérer un Pokémon par son ID
app.get("/api/pokemons/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pokemon = await Pokemon.findOne({ id: parseInt(id) });
    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon introuvable" });
    }
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


app.post("/api/pokemons", async (req, res) => {
  const newPokemon = new Pokemon(req.body);
  await newPokemon.save();
  res.status(201).json(newPokemon);
});

app.delete("/api/pokemons/:id", async (req, res) => {
  const { id } = req.params;
  await Pokemon.deleteOne({ id: parseInt(id) });
  res.status(204).send();
});

// In server.js - Update the random Pokémon route
app.get('/api/pokemons/random', async (req, res) => {
  try {
    const count = await Pokemon.countDocuments();
    const random = Math.floor(Math.random() * count);
    const randomPokemon = await Pokemon.findOne().skip(random).select('name english image');
    
    if (!randomPokemon) {
      return res.status(404).json({ error: "No Pokémon found" });
    }
    
    // Transform data to match frontend expectations
    const responseData = {
      name: randomPokemon.name,
      sprite: randomPokemon.image,
      type: randomPokemon.type
    };
    
    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
