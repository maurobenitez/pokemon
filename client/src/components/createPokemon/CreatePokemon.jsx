import React from "react";
import { createPokemon, getTypes } from "../../redux/actions";
import { useDispatch, useSelector } from 'react-redux';
import styles from "./CreatePokemon.module.css";
import { validateInput } from '../../validator.js';
import { validatorParams, errorMessages } from "./validatorParams";

const CreatePokemon = () => {
    const [input, setInput] = React.useState({
        name: "",
        image: "",
        hp: "",
        attack: "",
        defense: "",
        speed: "",
        height: "",
        weight: "",
        types: [],
        type: -1
    });
    const [error, setError] = React.useState({});

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getTypes());
    }, [dispatch]);

    const types = useSelector(state => state.types);

    const handleSubmit = (e) => {
        e.preventDefault();
        var errors = validateInput(input, validatorParams, errorMessages);
        setError(errors);
        if (!errors.name &&
            !errors.image &&
            !errors.hp &&
            !errors.attack &&
            !errors.defense &&
            !errors.speed &&
            !errors.height &&
            !errors.weight){
                dispatch(createPokemon(input));
            }
                            
    };

    const handleChange = ({target:{name, value}}) => {
        setInput({
            ...input,
            [name]: value
        })
    };

    const handleAddType = (e) => {
        var aux = input.types.find(type=>{
            if (type==input.type) return true;
            return false;
        });
        if (input.type != -1 && !aux)
        setInput({
            ...input,
            types: [...input.types, input.type],
        })
    };

    const handleRemoveType = ({target: {value}}) =>{      
        let types = input.types.filter(type => type !== value);
        setInput({
            ...input,
            types: types
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <h1>Añadir pokemon</h1>
            <ul className={styles.formElements}>
                <li className={styles.formRow}>
                    <label className={styles.label}>Nombre:</label>
                    <input type="text" name="name" onChange={handleChange} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.name}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Imagen:</label>
                    <input type="text" name="image" onChange={handleChange} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.image}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Vida:</label>
                    <input type="text" name="hp" onChange={handleChange} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.hp}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Ataque:</label>
                    <input type="text" name="attack" onChange={handleChange} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.attack}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Defensa:</label>
                    <input type="text" name="defense" onChange={handleChange} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.defense}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Velocidad:</label>
                    <input type="text" name="speed" onChange={handleChange} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.speed}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Altura:</label>
                    <input type="text" name="height" onChange={handleChange} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.height}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Peso:</label>
                    <input type="text" name="weight" onChange={handleChange} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.weight}</p>
            </ul>
            <select name="type" onChange = {handleChange} className={styles.select}>
                <option value="-1">Tipo de pokemon...</option>
                {
                    types && types.map
                    (
                        type => 
                        {
                            return (<option value={type.id}>{type.name}</option>)
                        }
                    )
                }
            </select>
            <button type="button" className={styles.addButton} onClick={handleAddType}>Añadir tipo</button>
            <div className={styles.itemsList}>
                {
                    input.types && input.types.map
                    (
                        type => 
                        {
                            let t1 = types.find(t2 => (t2.id == type));
                            return (
                                <fragment>
                                    <button className={styles.caption}>{t1.name}</button>
                                    <button type="button" className={styles.delete}value={t1.id} onClick={handleRemoveType}>X</button>
                                </fragment>
                            )
                        }
                    )
                }
            </div>
            <input className={styles.submitButton} type="submit" value="Añadir pokemon" />
        </form>
    )
}

export default CreatePokemon;