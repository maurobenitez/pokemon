import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ITEMS_PER_PAGE } from "../../../filtersAndPagination";
import { goToPage } from "../../../redux/actions";
import styles from "./Pagination.module.css";

const Pagination = () => {

    const dispatch = useDispatch();
    const page = useSelector(state => state.page);
    const pokemons = useSelector(state => state.sortedAndFilteredPokemons);
    const cantPages = Math.ceil(pokemons.length / ITEMS_PER_PAGE );
    const loading = useSelector(state=>state.loading);
    const handleClick = ({target: {name}}) =>{
        var next = 0;
        if (name === "prev" && page > 1) next = -1;
        if (name === "next" && page !== cantPages) next = 1;
        dispatch(goToPage(page+next));
    }
    return (
        <div>
            {!loading && (cantPages>1)&&(
                <div>
                    <button name="prev" onClick={handleClick} className={styles.button}>❮</button>
                    <span>{page} / {cantPages}</span>
                    <button name="next" onClick={handleClick} className={styles.button}>❯</button>
                </div>
            )}
        </div>
    )
}

export default Pagination;