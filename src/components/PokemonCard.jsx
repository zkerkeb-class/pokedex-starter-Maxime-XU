import useSound from 'use-sound';
import attackSound from '../sounds/attack.wav';
import defenseSound from '../sounds/defense.wav';
import faintSound from '../sounds/faint.mp3';
import React, { useState } from "react";
import "./PokemonCard.css";

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

const PokemonCard = ({ pokemon, onClick, onDelete }) => {
  const [playAttack] = useSound(attackSound);
  const [playDefense] = useSound(defenseSound);
  const [playFaint] = useSound(faintSound);
  const [playCry] = useSound(`/sounds/pokemon-cries/${pokemon.id}.wav`);
  
  const [hp, setHp] = useState(pokemon.base.HP);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [message, setMessage] = useState('');

  const handleAttack = () => {
    playAttack();
    playCry();
    setIsAnimating(true);
    setLastAction('attack');
    
    const newHp = Math.max(0, hp - 10);
    setHp(newHp);
    
    if(newHp <= 0) {
      playFaint();
      setMessage(`${pokemon.name.english} est K.O.!`);
    }
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDefense = () => {
    playDefense();
    setIsAnimating(true);
    setLastAction('defense');
    
    setHp(prev => Math.min(pokemon.base.HP, prev + 10));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div 
      className={`pokemon-card ${isAnimating ? lastAction : ''}`}
      onClick={onClick}
      style={{ 
        background: `linear-gradient(135deg, ${typeColors[pokemon.type[0]]}, #fff)`,
        '--type-color': typeColors[pokemon.type[0]]
      }}
    >

      <div className="card-header">
        <h2 className="pokemon-name">{pokemon.name.english}</h2>
        <span className="pokemon-hp">HP {hp}/{pokemon.base.HP}</span>
      </div>

      <img 
        src={pokemon.image} 
        alt={pokemon.name.english} 
        className="pokemon-image" 
        style={{ borderColor: typeColors[pokemon.type[0]] }}
      />


      <div className="type-container">
        {pokemon.type.map((t) => (
          <span 
            key={t} 
            className="pokemon-type" 
            style={{ 
              backgroundColor: typeColors[t],
              border: `1px solid ${shadeColor(typeColors[t], -30)}`
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="pokemon-stats">
        <p>⚔️ {pokemon.base.Attack} ATK</p>
        <p>🛡️ {pokemon.base.Defense} DEF</p>
        <p>🌟 {pokemon.base?.["Sp. Attack"]} SP.ATK</p>
        <p>💫 {pokemon.base?.["Sp. Defense"]} SP.DEF</p>
        <p>⚡ {pokemon.base.Speed} SPD</p>
      </div>

      <div className="pokemon-actions">
        <button 
          className="attack-button"
          onClick={(e) => { e.stopPropagation(); handleAttack(); }}
        >
          🗡️ Attaquer
        </button>
        <button 
          className="defense-button"
          onClick={(e) => { e.stopPropagation(); handleDefense(); }}
        >
          🛡️ Défense
        </button>
        <button 
          className="delete-button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          🗑️ Supprimer
        </button>
      </div>
      <div className="hp-container">
        <div 
          className="hp-bar" 
          style={{ width: `${(hp / pokemon.base.HP) * 100}%` }}
        />
        <span>❤️ {hp}/{pokemon.base.HP}</span>
      </div>
    </div>
  );
};

// Fonction utilitaire pour assombrir/éclaircir les couleurs
function shadeColor(color, percent) {
  // Ajoutez une vérification pour les valeurs undefined/null
  if (!color) return '#ffffff'; // Retourne une couleur par défaut (blanc) si color est undefined/null

  // Si la couleur est déjà au format hex court (3 caractères), convertissez-la en format long
  let hex = color.startsWith('#') ? color.substring(1) : color;
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // Vérification supplémentaire pour s'assurer que hex a 6 caractères
  if (hex.length !== 6) return '#ffffff';

  const R = parseInt(hex.substring(0, 2), 16);
  const G = parseInt(hex.substring(2, 4), 16);
  const B = parseInt(hex.substring(4, 6), 16);

  // Calcul des nouvelles valeurs avec le pourcentage
  const newR = Math.min(255, Math.max(0, R + (R * percent) / 100)).toString(16).padStart(2, '0');
  const newG = Math.min(255, Math.max(0, G + (G * percent) / 100)).toString(16).padStart(2, '0');
  const newB = Math.min(255, Math.max(0, B + (B * percent) / 100)).toString(16).padStart(2, '0');

  return `#${newR}${newG}${newB}`;
}

export default PokemonCard;