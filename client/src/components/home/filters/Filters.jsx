import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTypes, setFilters} from "../../../redux/actions";
import styles from "./Filters.module.css";
const Filters = () => {
    
    var dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTypes());
    }, [dispatch]);

    const types = useSelector(state => state.types);
    const filters = useSelector(state => state.filters);
    const loading = useSelector(state => state.loading);
    const onChangeHandler = (e) =>{
        var {name, value} = e.target;
        dispatch(setFilters({
            ...filters,
            [name]: value
        }))
    };

    return (
        <div>
            {!loading &&(
                <div>   
                    <select name="type" onChange={onChangeHandler} className={styles.select}>
                        <option value="">Tipos...</option>
                        {
                            types && types.map(type=>{
                                return (
                                    <option value={type.name}>{type.name}</option>
                                )
                            })
                        }
                    </select>
                    <select name="origin" onChange={onChangeHandler} className={styles.select}>
                        <option value="">Origen...</option>
                        <option value="db">Db</option>
                        <option value="api">Api</option>
                    </select>
                    <select name="sortBy" onChange={onChangeHandler} className={styles.select}>
                        <option value="name">Ordenar por...</option>
                        <option value="name">Nombre</option>
                        <option value="attack">Ataque</option>
                    </select>
                    <select name="order" onChange={onChangeHandler} className={styles.select}>
                        <option value="ASC">Ascendente</option>
                        <option value="DESC">Descendente</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default Filters;