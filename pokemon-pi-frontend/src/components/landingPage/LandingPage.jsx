import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";
import backgroundImage from '../../res/pokemonBackgroundImage.jpg';
const LandingPage = () => {
    return (
        <div className={styles.container}>
            <img className={styles.img} src={backgroundImage} alt="" />
            <div className={styles.jumbo}>
                <div className={styles.title}>
                    Henry Pokemon
                </div>
                <Link to="/pokemons">
                    <button className={styles.button}>Ingresar</button>
                </Link>
            </div>
        </div>
    );
}

export default LandingPage;