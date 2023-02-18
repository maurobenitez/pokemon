import React, {useEffect} from 'react';
import { getPokemons } from '../../../redux/actions';
import {useSelector, useDispatch} from "react-redux";
import PokemonCard from '../pokemonCard/PokemonCard';
import styles from './PokemonList.module.css';
import loadingImage from "../../../res/loading.gif";
import pokemonNotFound from '../../../res/pokemonNotFound.gif';

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
                (<img className={styles.loadingImage}src={loadingImage} alt="cargando..." />)
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
                }) : (<div>
                    <img className={styles.notFoundImage}src={pokemonNotFound}/>
                    <div className={styles.notFound}>Pokemon no encontrado</div>
                    </div>)
        }
        </div>
    );
}

export default PokemonList;