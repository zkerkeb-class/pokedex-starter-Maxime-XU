import React, { useState } from "react";
import axios from "axios";

const AddPokemonForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    image: "",
    hp: "",
    attack: "",
    defense: "",
    speed: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newPokemon = {
        id: parseInt(formData.id),
        name: { english: formData.name },
        type: formData.type.split(",").map(t => t.trim()),
        image: formData.image,
        base: {
          HP: parseInt(formData.hp),
          Attack: parseInt(formData.attack),
          Defense: parseInt(formData.defense),
          Speed: parseInt(formData.speed),
        },
      };

      console.log("Envoi du Pokémon:", newPokemon); // Debug
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/pokemons`, newPokemon);
      console.log("Réponse du serveur:", res.data); // Debug
      
      onAdd(res.data);
      setFormData({
        id: "",
        name: "",
        type: "",
        image: "",
        hp: "",
        attack: "",
        defense: "",
        speed: "",
      });
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur lors de l'ajout du Pokémon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper" onClick={onClose}>
      <form className="add-form" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Ajouter un Pokémon</h2>
        {error && <p className="form-error">{error}</p>}
        
        <div className="form-group">
          <label>ID</label>
          <input
            name="id"
            type="number"
            value={formData.id}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Nom (English)</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Types (séparés par virgule)</label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Ex: Fire, Flying"
            required
          />
        </div>

        <div className="form-group">
          <label>URL de l'image</label>
          <input
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="stats-grid">
          <div className="form-group">
            <label>HP</label>
            <input
              name="hp"
              type="number"
              value={formData.hp}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Attack</label>
            <input
              name="attack"
              type="number"
              value={formData.attack}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Defense</label>
            <input
              name="defense"
              type="number"
              value={formData.defense}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Speed</label>
            <input
              name="speed"
              type="number"
              value={formData.speed}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "En cours..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPokemonForm;