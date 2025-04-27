import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
  id: Number,
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String
  },
  type: [String],
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    Speed: Number
  },
  image: String
});

const Pokemon = mongoose.model("Pokemon", PokemonSchema);
export default Pokemon;
