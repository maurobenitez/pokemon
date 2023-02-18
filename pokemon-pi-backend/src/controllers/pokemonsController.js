const { Type, Pokemon } = require("../db.js");
const axios = require('axios');

const queryOptions = {
    include: {
        model: Type,
        attributes: ['id', 'name'],
        through: { attributes: [] },
    }
};

var pokemonsFromApi = null;

async function getPokemonById(id){
    try{
        var { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        var pokemon = extractFieldsFromPokemonData(data);
    }catch(error){
        var pokemonFromDb = await getPokemonFromDbById(parseInt(id));
        var pokemon = pokemonFromDb ? pokemonFromDb : null;
    }
    return pokemon;
}

async function getAllPokemons(pokemonName){
    if (!pokemonName){
        if (!pokemonsFromApi){
            var {data: {results: pokemonsRaw}} = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=40`);
            var pokemonsFromApiPromises = pokemonsRaw.map(async ({url})=>{
                var data = await getDataFromUrl(url);
                return getPokemonMainData(data);                       
            });
            pokemonsFromApi = await Promise.all(pokemonsFromApiPromises);
        }
        var pokemonsFromDb = await getAllPokemonsFromDb();
        var pokemons = [...pokemonsFromDb, ...pokemonsFromApi];
    }else{
        try{
            var { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            var pokemons = [await getPokemonMainData(data)];
        }catch(error){
            var pokemonFromDb = await getPokemonFromDbByName(pokemonName);
            pokemons = pokemonFromDb ? [pokemonFromDb] : [];
        }
    }
    return {pokemons};
}

async function createPokemon(pokemonData){
    if (await Type.count() === 0) await loadTypes(); 
    try{
        try{
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonData.name}`);
            throw new Error("Ya existe pokemon con ese nombre");
        }catch(error){
            if (!error.response)
                throw new error("Ya existe pokemon con ese nombre");
        }
        var {name, hp, attack, defense, speed, height, weight, types, image} = pokemonData;
        var pokemon = {name, hp, attack, defense, speed, height, weight, image};
        try{
            var newPokemon = await Pokemon.create(pokemon);
            if (types) {
                newPokemon = await newPokemon.addTypes(types);
            }
        }catch(error){
            throw new error("Ya existe un pokemon con ese nombre")
        }
        return(newPokemon);
    }catch(error){
        throw new Error(error.message);
    }
}

async function getPokemonFromDbById(pokemonId){
    var query = {where: {id: pokemonId}};
    var pokemonFromDb = await Pokemon.findAll({
        ...queryOptions,
        query,
        plain: true
    });
    return pokemonFromDb;
}

function extractFieldsFromPokemonData(pokemonData) {
    var { id, name, height, weight, stats, sprites, types } = pokemonData;
    var { other: { dream_world: { front_default: image } } } = sprites;
    var st = { hp: 0, attack: 0, defense: 0, speed: 0 };
    stats.forEach(stat => {
        st[stat.stat.name] = stat.base_stat;
    });
    types = types.map(({type}) => extractFieldsFromTypeData(type));
    var pokemon = { id, name, height, weight, hp: st.hp, attack: st.attack, defense: st.defense, speed: st.speed, image, types };
    return pokemon;
}

function extractFieldsFromTypeData({name, url}){
    var urlList = url.split("/");
    var id = urlList[urlList.length - 2];
    return { id, name };
}

async function getDataFromUrl(url){
    var connectionSuccess = false;
    while (!connectionSuccess){
        try{
            var {data} = await axios.get(url);
            connectionSuccess = true;
        }catch(error){
            console.log(`Conexión fallida con la url ${url}, reintentando`);
        }
    }
    return data;
}

async function getPokemonMainData(pokemonData) {
    var { sprites, types, stats, name, id } = pokemonData;
    var { other: { dream_world: { front_default: image } } } = sprites;
    types = types.map(({ type }) => extractFieldsFromTypeData(type));
    var attack;
    stats.forEach(stat => {
        if (stat.stat.name === "attack")
            attack = stat.base_stat;
    });
    return { id, name, image, types, attack };
}

async function getPokemonFromDbByName(pokemonName){
    var query = {where: {name: pokemonName}};
    var pokemonFromDb = await Pokemon.findAll({
        ...{attributes: ["id", "name", "image", "attack"]},
        ...queryOptions,
        ...query,
        plain: true
    });
    return pokemonFromDb;
}

async function getAllPokemonsFromDb(){
    var pokemonsFromDb = await Pokemon.findAll({
        ...{attributes: ["id", "name", "image", "attack"]},
        ...queryOptions,
    });
    return pokemonsFromDb;
}

async function loadTypes() {
    var { data: { results: typesRaw } } = await axios.get("https://pokeapi.co/api/v2/type");
    var types = typesRaw.map((type) => extractFieldsFromTypeData(type));
    await Type.bulkCreate(types);
}

module.exports = {
    getPokemonById,
    createPokemon,
    getAllPokemons
}