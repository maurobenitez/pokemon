import React from "react";
import { getPokemonDetail } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import styles from './PokemonDetail.module.css';

const PokemonDetail = (props) =>{
    const dispatch = useDispatch();
    let id = props.match.params.id;
    React.useEffect(() => dispatch(getPokemonDetail(id)), [dispatch, id]);
    let pokemon = useSelector(state => state.detail);
    let loading = useSelector(state => state.loading);
    if (pokemon !== null)
        var {name, hp, attack, defense, speed, height, weight, image, types } = pokemon;
    return (
        <div className={styles.center}>
            {loading?
                (<span>...loading detail</span>)
            :pokemon !== null ?
                (<div className={styles.card}>
                    <h1>{name}</h1>
                    <img src={image}></img>
                    <p className={styles.text}>vida: {hp}</p>
                    <p className={styles.text}>ataque: {attack}</p>
                    <p className={styles.text}>defensa: {defense}</p>
                    <p className={styles.text}>velocidad: {speed}</p>
                    <p className={styles.text}>altura: {height}</p>
                    <p className={styles.text}>peso: {weight}</p>
                    {types && types.map(type => {
                        return (
                            <p className={styles.type}>{type.name}</p>
                        )
                    })}
                </div>)
                :(<span>no se encontró pokemon</span>)
        }
        </div>
    )
}

export default PokemonDetail;