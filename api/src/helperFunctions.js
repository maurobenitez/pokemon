const { Type, Pokemon } = require("./db.js");
const axios = require('axios');


/* este objeto contiene los parámetros para para traer junto con un pokemon con sequelize, sus types*/
const queryOptions = {
    include: {
        model: Type,
        attributes: ['id', 'name'],
        through: { attributes: [] },
    }
};

/* a partir de un objeto con los datos de un type, genera un nuevo objeto con los siguientes campos:
 id y name. */ 
function extractFieldsFromTypeData({name, url}){
    var urlList = url.split("/");
    var id = urlList[urlList.length - 2];
    return { id, name };
}
/* A partir de un objecto con los datos de un pokemon genera un nuevo objeto con los siguientes campos:
id, name, height, weight, hp, attack, defense, speed, image y types
*/
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

/* usa axios para traer datos de una url, y si hay un error, reintenta hasta que lo logre*/
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

/* A partir de un objeto con los datos de un pokemon devuelve otro objeto con los siguientes campos:
name, image, types y attack */
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

/* busca los types en la api de pokemon y los carga en la db */

async function loadTypes() {
    var { data: { results: typesRaw } } = await axios.get("https://pokeapi.co/api/v2/type");
    var types = typesRaw.map((type) => extractFieldsFromTypeData(type));
    await Type.bulkCreate(types);
}

/* esta función busca en la base de datos un pokemon con un id determinado */
async function getPokemonFromDbById(pokemonId){
    var query = {where: {id: pokemonId}};
    var pokemonFromDb = await Pokemon.findAll({
        ...queryOptions,
        query,
        plain: true
    });
    return pokemonFromDb;
}

/* Esta función busca un pokemon de la db que coincida con un nombre determinado. Del pokemon que devuelve trae los atributos id, name, image, types y attack */
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
/* Esta función busca todos los pokemons de la db, junto con sus tipos. Los atributos que trae son:
id, name, image, types y attack */

async function getAllPokemonsFromDb(){
    var pokemonsFromDb = await Pokemon.findAll({
        ...{attributes: ["id", "name", "image", "attack"]},
        ...queryOptions,
    });
    return pokemonsFromDb;
}

module.exports = {queryOptions, extractFieldsFromPokemonData, getPokemonMainData, loadTypes, getDataFromUrl, getPokemonFromDbById, getPokemonFromDbByName, getAllPokemonsFromDb };