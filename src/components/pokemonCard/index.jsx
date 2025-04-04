
import { useState, useEffect } from "react"
import './index.css'

const PokemonCard = ({ name, types, image, attack, defense, hp, spattack, spdefense, speed }) => {
    const [currentHP, setCurrentHP] = useState(hp)

    /*useEffect(() => {
        alert("le combat commence")
    
    }, [])*/

    useEffect(() => {
        console.log('currentHP useEffect', currentHP)
        if (currentHP <= 0) {
            alert("bulbizarre est mort")
        }
    }, [currentHP])

    const handleAttack = () => {
        console.log("bulbizarre se mange une patate")
        setCurrentHP(currentHP - 10)
    }

    return (
        <div className="pokemon-card">
            <h1>{name}</h1>
            <img src={image} alt={name} />
            <div className="types">
            {types.map((type) => {
                return (
                    <p key={type}>{type}</p>
                )
            })}
            </div>
            <div className="stats">
            <p>HP: {hp}</p>
            <p>Attack: {attack}</p>
            <p>Defense: {defense}</p>
            <p>Sp. Attack: {spattack}</p>
            <p>Sp. Defense: {spdefense}</p>
            <p>Speed: {speed}</p>
            </div>
            <button onClick={handleAttack}>Attack</button>

        </div>
    )
}

export default PokemonCard