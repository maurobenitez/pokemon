import React, {useEffect} from 'react';
import { getPokemons } from '../../../redux/actions';
import {useSelector, useDispatch} from "react-redux";
import PokemonCard from '../pokemonCard/PokemonCard';
import styles from './PokemonList.module.css';

const PokemonList = () => {
    var dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPokemons());
    }, [dispatch]);
    const pokemons = useSelector(state => state.pokemons);
    const loading = useSelector(state => state.loading);
    return (
        <div className={styles.pokemons}>{
            loading?
                (<span>loading...</span>)
            :
                pokemons.length > 0 ? pokemons.map(pokemon => {
                    return (
                        <PokemonCard
                            key={pokemon.id}
                            id={pokemon.id}
                            name={pokemon.name}
                            image={pokemon.image}
                            types={pokemon.types}
                        />

                    )
                }) : (<span>no se encontró pokemon</span>)
        }
        </div>
    );
}

export default PokemonList;