import styles from "./PokemonDetailNavBar.module.css"
import { Link } from "react-router-dom";
const PokemonDetailNavBar = () => {
    return (
        <nav className={styles.nav}>
            <div>
                <Link to={"/pokemons"} className={styles.link}>
                    Henry Pokemon
                </Link>
            </div>
            <div> </div>
            <div>
                <Link to={"/"}>
                    <button className={styles.button}>ir a landing page</button>
                </Link>
                <Link to={"/pokemons/create"}>
                    <button className={styles.button}>Crear Pokemon</button>
                </Link>
            </div>
        </nav>
    );
};

export default PokemonDetailNavBar;