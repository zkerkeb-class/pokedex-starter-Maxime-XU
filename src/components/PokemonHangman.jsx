import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PokemonHangman = () => {
  const [pokemon, setPokemon] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('loading');
  const [error, setError] = useState(null);
  const MAX_WRONG_GUESSES = 6;
  const navigate = useNavigate();

  // Fetch random Pokémon from backend
  useEffect(() => {
    const fetchRandomPokemon = async () => {
      try {
        setGameStatus('loading');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pokemons/random`);
        
        if (!response.data || !response.data.name || !response.data.name.english) {
          throw new Error('Invalid Pokémon data received');
        }
        
        setPokemon({
          name: response.data.name,
          sprite: response.data.sprite,
          type: response.data.type
        });
        setGameStatus('playing');
      } catch (error) {
        console.error("Error fetching random Pokémon:", error);
        setError("Failed to load Pokémon. Please try again.");
        setGameStatus('error');
      }
    };
    fetchRandomPokemon();
  }, []);

  // Check win condition
  useEffect(() => {
    if (!pokemon || gameStatus !== 'playing') return;
    
    const pokemonName = pokemon.name.english.toUpperCase();
    const isWon = pokemonName
      .split('')
      .every(letter => guessedLetters.includes(letter) || !/[A-Z]/.test(letter));
    
    if (isWon) setGameStatus('won');
  }, [guessedLetters, pokemon, gameStatus]);

  // Handle letter guess
  const handleGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;
    
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!pokemon.name.english.toUpperCase().includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
      }
    }
  };

  // Render word with blanks
  const renderWord = () => {
    if (!pokemon) return null;
    
    return pokemon.name.english.toUpperCase().split('').map((char, i) => (
      <span key={i} style={{ margin: '0 5px', fontSize: '24px' }}>
        {guessedLetters.includes(char) || !/[A-Z]/.test(char) ? char : '_'}
      </span>
    ));
  };

  // Render hangman stages
  const renderHangman = () => {
    const stages = [
      <div key="0">_______</div>,
      <div key="1">|</div>,
      <div key="2">O</div>,
      <div key="3">/|\</div>,
      <div key="4">|</div>,
      <div key="5">/ \</div>
    ];
    
    return stages.slice(0, wrongGuesses);
  };

  if (gameStatus === 'loading') {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Pokémon...</p>
      </div>
    );
  }

  if (gameStatus === 'error') {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="hangman-container">
      <h1>Pokémon Hangman</h1>
      
      <div className="hangman-display">
        {renderHangman()}
      </div>
      
      <div className="pokemon-info">
        {pokemon.sprite && (
          <img 
            src={pokemon.sprite} 
            alt={pokemon.name.english}
            style={{ 
              filter: gameStatus === 'lost' ? 'grayscale(100%)' : 'none',
              width: '120px'
            }}
          />
        )}
        {pokemon.type && (
          <div className="pokemon-types">
            {pokemon.type.map(type => (
              <span 
                key={type} 
                className="type-badge"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="word-display">
        {renderWord()}
      </div>
      
      {gameStatus === 'won' && (
        <div className="game-message success">
          🎉 You won! It's {pokemon.name.english}!
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="game-message error">
          😢 Game over! It was {pokemon.name.english}.
        </div>
      )}
      
      <div className="keyboard">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
            className={`key ${guessedLetters.includes(letter) ? 
              (pokemon.name.english.toUpperCase().includes(letter) ? 'correct' : 'wrong') : ''}`}
          >
            {letter}
          </button>
        ))}
      </div>
      
      <div className="game-controls">
        <button 
          onClick={() => window.location.reload()}
          className="new-game-btn"
        >
          New Game
        </button>
        <button 
          onClick={() => navigate('/')}
          className="back-btn"
        >
          Back to Pokédex
        </button>
      </div>
    </div>
  );
};

// Helper function for type colors
const getTypeColor = (type) => {
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
  return typeColors[type] || "#777";
};

export default PokemonHangman;