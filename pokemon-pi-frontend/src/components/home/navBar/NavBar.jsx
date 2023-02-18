import styles from "./NavBar.module.css"
import Search from "../search/Search.jsx";
import { Link } from "react-router-dom";
const NavBar = () => {
    return (
        <nav className={styles.nav}>
            <div classname={styles.logo}>Henry pokemon</div>
            <Search/>
            <div>
                <Link to={"/"}>
                    <button className={styles.button}>ir a landing page</button>
                </Link>
                <Link className={styles.link} to={"/pokemons/create"}>
                    <button className={styles.button}>Crear Pokemon</button>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;