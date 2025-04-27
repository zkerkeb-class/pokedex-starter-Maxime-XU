import mongoose from "mongoose";
import dotenv from "dotenv";
import pokemonsList from "./pokemons.json";
//import Pokemon from "./models/Pokemon.js";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connecté à MongoDB");

    await Pokemon.deleteMany(); // Supprime les anciennes données
    await Pokemon.insertMany(pokemonsList);
    console.log("Données insérées !");
  } catch (error) {
    console.error("Erreur MongoDB :", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Connexion fermée");
  }
}

seedDatabase();
