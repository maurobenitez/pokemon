import React from "react";
import { createPokemon, getTypes } from "../../redux/actions";
import { useDispatch, useSelector } from 'react-redux';
import styles from "./CreatePokemon.module.css";
import { validateInput, validateField } from '../../validator.js';
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

    const backendError = useSelector(state => state.backendError);

    React.useEffect(() => {
        if(backendError==="name must be unique"){
            alert(`Ya se encuentra creado un pokemon con el nombre ${input.name}`);
            setError({...error, name: "Hay otro pokemon en la base de datos con el mismo nombre"});
        }else if (backendError==="pokemon created sucessfully"){
            alert('pokemon creado de forma exitosa')
        }
    }, [backendError]);

    const types = useSelector(state => state.types);
    const handleSubmit = (e) => {
        e.preventDefault();
        var [isValid, errors] = validateInput(input, validatorParams, errorMessages);
        setError(errors);
        if (isValid){
            dispatch(createPokemon(input));
        }
        setError(errors);                          
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
        if (aux != undefined) alert("tipo de pokemon ya añadido");
        if (input.type != -1 && !aux && input.types.length <2)
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

    const handleBlur = ({target: {name, value}}) => {
        var errorMessage = validateField(value, validatorParams[name], errorMessages[name]);
        setError({...error, [name]: errorMessage});
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Añadir pokemon</h1>
            <ul className={styles.formElements}>
                <li className={styles.formRow}>
                    <label className={styles.label}>Nombre:</label>
                    <input type="text" name="name" onChange={handleChange} onBlur={handleBlur} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.name}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Imagen:</label>
                    <input type="text" name="image" onChange={handleChange} onBlur={handleBlur} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.image}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Vida:</label>
                    <input type="text" name="hp" onChange={handleChange} onBlur={handleBlur} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.hp}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Ataque:</label>
                    <input type="text" name="attack" onChange={handleChange} onBlur={handleBlur} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.attack}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Defensa:</label>
                    <input type="text" name="defense" onChange={handleChange} onBlur={handleBlur} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.defense}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Velocidad:</label>
                    <input type="text" name="speed" onChange={handleChange} onBlur={handleBlur} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.speed}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Altura:</label>
                    <input type="text" name="height" onChange={handleChange} onBlur={handleBlur} className={styles.input}/>
                </li>
                <p className={styles.danger}>{error.height}</p>
                <li className={styles.formRow}>
                    <label className={styles.label}>Peso:</label>
                    <input type="text" name="weight" onChange={handleChange} onBlur={handleBlur} className={styles.input}/>
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