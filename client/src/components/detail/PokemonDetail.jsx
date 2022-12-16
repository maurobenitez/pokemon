import React from "react";
import { getPokemonDetail } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import styles from './PokemonDetail.module.css';
import pokemonNotFound from '../../res/pokemonNotFound.gif';
import loadingImage from "../../res/loading.gif";

const PokemonDetail = (props) => {
    const dispatch = useDispatch();
    let id = props.match.params.id;
    React.useEffect(() => dispatch(getPokemonDetail(id)), [dispatch, id]);
    let pokemon = useSelector(state => state.detail);
    let loading = useSelector(state => state.loading);
    if (pokemon !== null)
        var { name, hp, attack, defense, speed, height, weight, image, types } = pokemon;
    return (
        <div className={styles.center}>
            {loading ?
                (
                    <img className={styles.loadingImage} src={loadingImage} alt="cargando..." />)
                : pokemon !== null ?
                    (<div>
                        <div className={styles.card}>
                            
                        </div>
                        <div className={styles.properties}>
                            <p className={styles.stats}>vida: {hp}</p>
                            <p className={styles.stats}>ataque: {attack}</p>
                            <p className={styles.stats}>defensa: {defense}</p>
                            <p className={styles.stats}>velocidad: {speed}</p>
                            <p className={styles.others}>altura: {height}</p>
                            <p className={styles.others}>peso: {weight}</p>
                        </div>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src={image} alt={image} />
                            <h1 className={styles.name}>{name}</h1>
                        </div>
                        <div className={styles.idContainer}>
                            <p className={styles.id}>{id}</p>
                        </div>
                        <div className={styles.typesContainer}>
                        {types && types.map(type => {
                                return (
                                    <div className={styles.type}>{type.name}</div>
                                )
                            })}
                        </div>
                    </div>)
                    : (<div>
                        <img className={styles.notFoundImage} src={pokemonNotFound} />
                        <div className={styles.notFound}>Pokemon no encontrado</div>
                    </div>
                    )
            }
        </div>
    )
}

export default PokemonDetail;