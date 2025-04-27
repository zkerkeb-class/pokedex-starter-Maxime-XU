import express from "express";
import Pokemon from "../models/Pokemon.js";

const router = express.Router();

// 🔎 Route pour récupérer tous les Pokémon
router.get("/", async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// 🎲 Route pour récupérer un Pokémon aléatoire
router.get("/random", async (req, res) => {
  try {
    const count = await Pokemon.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: "Aucun Pokémon trouvé dans la base de données" });
    }
    
    const random = Math.floor(Math.random() * count);
    const pokemon = await Pokemon.findOne().skip(random);
    
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon aléatoire non trouvé" });
    }

    // Return only necessary fields for Hangman game
    res.json({
      name: pokemon.name,
      sprite: pokemon.image,
      type: pokemon.type
    });
  } catch (error) {
    console.error("Erreur dans la route /random:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
});

// 🔍 Route pour rechercher un Pokémon par ID
router.get("/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) return res.status(404).json({ message: "Pokémon non trouvé" });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
