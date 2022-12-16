import styles from "./CreatePokemonNavBar.module.css"
import { Link } from "react-router-dom";
const CreatePokemonNavBar = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.left}>
                <Link to={"/pokemons"}>
                    <button className={styles.back}>❮</button>
                </Link>
                <Link to={"/pokemons"} className={styles.link}>
                    <span>Henry pokemon</span>
                </Link>
            </div>
            <div></div>
            <Link to={"/"}>
                <button className={styles.button}>ir a landing page</button>
            </Link>
        </nav>
    );
};

export default CreatePokemonNavBar;