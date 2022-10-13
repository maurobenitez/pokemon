const { Type } = require("./db.js");
const axios = require('axios');

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
    urlList = url.split("/");
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


/* A partir de la url de un pokemon devuelve un objeto con los siguientes campos:
name, image, types y attack */

async function getPokemonMainData(url) {
    var {
        data: {
            sprites: { other: { dream_world: { front_default: image } } }, types, stats, name, id
        }
    } = await axios.get(url);
    /* en esta parte tomo el objeto types, y para cada type me quedo solo con los campos id y name */
    types = types.map(({ type: { name, url } }) => {
        urlList = url.split("/");
        let id = urlList[urlList.length - 2];
        return { id, name };
    });
    /* aquí busco el valor de attack que está en el objeto stats, y guardo
    el resultado en la variable attack */
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

module.exports = {queryOptions, extractFieldsFromPokemonData, getPokemonMainData, loadTypes };