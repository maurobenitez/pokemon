import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchPokemon } from "../../../redux/actions";
import styles from "./Search.module.css";

const Search = () =>{
    const [searchTerm, setSearchTerm] = React.useState("");
    const dispatch = useDispatch();
    const onChangeHandler = ({target:{value}})=>{
        setSearchTerm(value);
    };

    const onClickHandler = (e) =>{
        dispatch(searchPokemon(searchTerm));
        setSearchTerm("");

    };
    const loading = useSelector(state=>state.loading);
    return (
        <div>
            {!loading && (
                <div>
                    <input type="text" onChange={onChangeHandler} className={styles.search}/>
                    
                        <button onClick={onClickHandler} className={styles.search}>Buscar</button>
                    
                </div>
            )}
        </div>
    );
}

export default Search;