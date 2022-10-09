import { GET_TYPES, SEARCH_POKEMON, LOADING_DATA, GET_POKEMON_DETAIL, GO_TO_PAGE, SET_FILTERS, RECEIVE_POKEMONS} from "./actions";

import { sortAndFilter, getPage } from "../filtersAndPagination";

const initialState = {
    allPokemons: [],
    sortedAndFilteredPokemons: [],
    pokemons: [],
    types: [],
    detail:{},
    loading: false,
    filters: {
        type: "",
        origin: "",
        sortBy: "name",
        order: "ASC"
    },
    page: 1
};


const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case RECEIVE_POKEMONS:
            var sortedAndFilteredPokemons = sortAndFilter(action.payload, state.filters);
			var pokemons = getPage(sortedAndFilteredPokemons, state.page);
            return {
                ...state,
                allPokemons: action.payload,
                sortedAndFilteredPokemons,
                pokemons,
                allPokemons: action.payload,
                page: 1,
                loading: false
            }
        case GET_TYPES:
            return {
                ...state,
                types: action.payload
            }
        case GET_POKEMON_DETAIL:
            return {
                ...state,
                detail: action.payload,
                loading: false
            }
        case SEARCH_POKEMON:
            return {
                ...state,
                pokemons: action.payload,
                page: 1,
                loading: false
            }
        case SET_FILTERS:
            var sortedAndFilteredPokemons = sortAndFilter(state.allPokemons, action.payload);
			var pokemons = getPage(sortedAndFilteredPokemons, state.page)
            return {
                ...state,
                pokemons,
                sortedAndFilteredPokemons,
                filters: action.payload,
                page: 1

            }
        case GO_TO_PAGE:
            var sortedAndFilteredPokemons = sortAndFilter(state.allPokemons, state.filters);
			var pokemons = getPage(sortedAndFilteredPokemons, action.payload);
			return {
				...state,
				pokemons,
				sortedAndFilteredPokemons,
				page: action.payload
			}
        default:
            return state;
    }
};

export default rootReducer;