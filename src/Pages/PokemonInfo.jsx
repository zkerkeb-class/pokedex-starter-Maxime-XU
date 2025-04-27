import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PokemonInfo.css"; 

const typeColors = {
  Grass: "#78C850",
  Poison: "#A040A0",
  Fire: "#F08030",
  Flying: "#A890F0",
  Water: "#6890F0",
  Bug: "#A8B820",
  Normal: "#A8A878",
  Electric: "#F8D030",
  Ground: "#E0C068",
  Fairy: "#EE99AC",
  Fighting: "#C03028",
  Psychic: "#F85888",
  Rock: "#B8A038",
  Steel: "#B8B8D0",
  Ice: "#98D8D8",
  Ghost: "#705898",
  Dragon: "#7038F8",
  Dark: "#705848",
};

const PokemonInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pokemons`)
      .then((response) => {
        const allPokemons = response.data;
        const selected = allPokemons.find((p) => String(p.id) === id);
        if (!selected) {
          navigate("/"); // Redirection si le Pokémon n'existe pas
        }
        setPokemon(selected);

        // Suggestions aléatoires
        const otherPokemons = allPokemons.filter((p) => String(p.id) !== id);
        const randomSuggestions = otherPokemons.sort(() => 0.5 - Math.random()).slice(0, 4);
        setSuggestions(randomSuggestions);
      })
      .catch(() => {
        navigate("/");
      });
  }, [id, navigate]);

  const handleDelete = () => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/pokemons/${id}`).then(() => {
      navigate("/");
    });
  };

  if (!pokemon) return <div>Chargement...</div>;

  return (
    <div className="pokemon-info-container">
      <div className="pokemon-info-card">
        <h2>{pokemon.name.english}</h2>
        <img src={pokemon.image} alt={pokemon.name.english} />

        <div className="pokemon-info-types">
          {pokemon.type.map((type) => (
            <span key={type} style={{ backgroundColor: typeColors[type] || "#ccc" }}>
              {type}
            </span>
          ))}
        </div>

        <div className="pokemon-info-stats">
          <p>HP: {pokemon.base.HP}</p>
          <p>Attack: {pokemon.base.Attack}</p>
          <p>Defense: {pokemon.base.Defense}</p>
          <p>SP.ATK: {pokemon.base?.["Sp. Attack"]}</p>
          <p>SP.DEF: {pokemon.base?.["Sp. Defense"]}</p>
          <p>Speed: {pokemon.base.Speed}</p>
        </div>

        <div className="pokemon-info-actions">
          <button className="back-button" onClick={() => navigate("/")}>⬅️ Retour</button>
          <button className="back-button" onClick={handleDelete}>🗑️ Supprimer</button>
        </div>
      </div>

      <div className="pokemon-suggestions">
            <h3>Découvre aussi ces Pokémon :</h3>
            <div className="suggestion-carousel">
                <div className="suggestion-track">
                {suggestions.map((suggested, index) => (
                    <div 
                    key={suggested.id}
                    className="suggestion-bubble"
                    style={{ '--i': index }}
                    onClick={() => navigate(`/pokemon/${suggested.id}`)}
                    >
                    <img src={suggested.image} alt={suggested.name.english} />
                    <p>{suggested.name.english}</p>
                    </div>
                ))}
                </div>
            
                <div className="carousel-controls">
                <button className="carousel-btn" onClick={() => {}}>←</button>
                <button className="carousel-btn" onClick={() => {}}>→</button>
                </div>
            </div>
         </div>
    </div>
  );
};

export default PokemonInfo;