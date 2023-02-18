export const ITEMS_PER_PAGE = 12;

const filterByType = (pokemon, name) =>{
    var { types } = pokemon;
    return (name === "" || types.some( type => type.name === name ));
};

const filterByOrigin = (pokemon, origin) => {
    if (origin === "") return true;
    if (pokemon.id >= 20000 && origin === "db") return true;
    if (pokemon.id < 20000 && origin === "api") return true;
    return false;
}
    
export const filterPokemons = (pokemons, params)=>{
    var {type, origin} = params;
    var filteredPokemons = pokemons.filter( pokemon => {
        return filterByType(pokemon, type) && filterByOrigin(pokemon, origin)
    });
    return filteredPokemons;
}

const sorters = {
 
    name: (a, b)=>{
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    },
    
    attack: (a, b) => {
        a = a.attack;
        b = b.attack;
        return a - b;
    }
}


export const sortPokemons = (pokemons, params)=>{
    var {sortBy, order} = params;
    pokemons.sort((a,b)=>{
        if (order === "DESC") [a, b] = [b, a];
        var sorter = sorters[sortBy];
        return sorter(a,b);
    });
    return pokemons;
}

export const sortAndFilter = (pokemons, params)=>{
    var filteredPokemons = filterPokemons(pokemons, params);
    var sortedPokemons = sortPokemons(filteredPokemons, params);
    return sortedPokemons;
}

export const getPage = (list, pageNumber) => {
    var start = (pageNumber -1) * ITEMS_PER_PAGE;
    var end = start + ITEMS_PER_PAGE;
    if (end >= list.length ) return list.slice(start);
    return list.slice(start, end);
}