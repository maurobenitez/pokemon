import React from "react";
import styles from "./PokemonCard.module.css";
import { Link } from 'react-router-dom';

const PokemonCard = ({id, name, types, image}) => {
    return(

        <div className={styles.card}>
            <Link className={styles.link} to={`/pokemon/${id}`}>
                <h2>{name}</h2>
            </Link>
            <Link className = {styles.link} to={`/pokemon/${id}`}>
                <img className={styles.image} src={image} alt={name} />
            </Link>
            <div className={styles.types}>
                {types.map(type=>{
                    return (
                        <span className={styles.type}>{type.name}</span>
                    )
                })}
            </div>
        </div>
    )
}

export default PokemonCard;