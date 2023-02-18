const axios = require('axios');

export const GET_POKEMONS = "GET_POKEMONS";
export const GET_TYPES = "GET_TYPES";
export const SEARCH_POKEMON = "SEARCH_POKEMON";
export const LOADING_DATA = "LOADING_DATA";
export const GET_POKEMON_DETAIL = "GET_POKEMON_DETAIL";
export const GO_TO_PAGE = "GO_TO_PAGE";
export const CREATE_POKEMON = "CREATE_POKEMON";
export const SET_FILTERS = "SET_FILTERS";
export const RECEIVE_POKEMONS = "RECEIVE_POKEMONS";

export const getPokemons = () =>
    async dispatch =>{
        dispatch(loadingData());
        var {data: {pokemons}} = await axios.get('http://localhost:3001/pokemons');
        dispatch(receivePokemons(pokemons));
    }

export const getTypes = () =>
    async dispatch => {
        var {data} = await axios.get('http://localhost:3001/types');
        dispatch({type: GET_TYPES, payload: data});
    }

export const searchPokemon = (pokemonName) =>
    async dispatch =>{
        dispatch(loadingData());
        var {data: {pokemons}} = await axios.get(`http://localhost:3001/pokemons?name=${pokemonName}`);
        dispatch({type: SEARCH_POKEMON, payload: pokemons});
    }

export const loadingData = () =>
    ({type: LOADING_DATA})

export const receivePokemons = (pokemons) =>
    ({type: RECEIVE_POKEMONS, payload: pokemons})

export const getPokemonDetail = (id) =>
    async dispatch =>{
        dispatch(loadingData());
        var {data: {pokemon}} = await axios.get(`http://localhost:3001/pokemons/${id}`);
        dispatch({type: GET_POKEMON_DETAIL, payload: pokemon});
    }

export const goToPage = (page) =>
    ({type: GO_TO_PAGE, payload: page})

export const createPokemon = (pokemon) =>
    async dispatch => {
        var {data} = await axios.post('http://localhost:3001/pokemons', pokemon);
        dispatch({type: CREATE_POKEMON, payload: data});
    }

export const setFilters = (filter) =>
    ({type: SET_FILTERS, payload: filter})
