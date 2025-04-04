import { useState } from 'react'
import pokemons from './assets/pokemons'
import PokemonCard from './components/pokemonCard'
import './App.css'


function App() {
  const [searchTerm, setSearchTerm] = useState(''); // État pour la barre de recherche
  const [currentPokemons, setCurrentPokemons] = useState(pokemons); // État pour la liste filtrée

  // Fonction pour filtrer les Pokémon en fonction de la recherche
  const handleSearch = (event) => {
    const term = event.target.value; // Récupérer la valeur de la barre de recherche
    setSearchTerm(term); // Mettre à jour le terme de recherche

    // Filtrer les Pokémon dont le nom correspond au terme de recherche
    const filtered = pokemons.filter((pokemon) =>
      pokemon.name.french.toLowerCase().includes(term.toLowerCase())
    );

    setCurrentPokemons(filtered); // Mettre à jour la liste filtrée
  };

  return (
    <div className="App">
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un Pokémon..."
        value={searchTerm}
        onChange={handleSearch} // Mettre à jour le filtre à chaque saisie
        className="search-bar"
      />

      <div className="pokemon-list">
        {currentPokemons.map((pokemon, index) => (
          <PokemonCard
            key={index}
            name={pokemon.name.french}
            types={pokemon.type}
            image={pokemon.image}
            attack={pokemon.base.Attack}
            defense={pokemon.base.Defense}
            spattack={pokemon.base['Sp. Attack']}
            spdefense={pokemon.base['Sp. Defense']}
            speed={pokemon.base.Speed}
            hp={pokemon.base.HP}
          />
        ))}
      </div>
    </div>
  )
}

export default App
