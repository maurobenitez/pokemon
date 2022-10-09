const { Router } = require('express');
const axios = require('axios');
const { Pokemon, Type, conn, Op} = require("../db.js");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const queryOptions = {
    include: {
        model: Type,
        attributes: ['id', 'name'],
        through: {attributes: []},      
    }
};

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

/* esta ruta devuelve un objeto con los datos de un pokemon de la api o de la db en base a un id.
Los campos del objeto son name, height, weight, hp, attack, deffense, speed e image.
*/
var pokemonsCache = [];

router.get('/pokemons/:id', async (req, res)=>{
    try{
        var {id} = req.params;
        var { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        var { id, name, height, weight, stats, sprites, types } = data;
        var { other: { dream_world: { front_default: image } } } = sprites;
        var st = { hp: 0, attack: 0, defense: 0, speed: 0 };
        stats.forEach(stat => {
            st[stat.stat.name] = stat.base_stat;
        });
        types = types.map(({ type: { name, url } }) => {
            urlList = url.split("/");
            var id = urlList[urlList.length - 2];
            return { id, name };
        });
        var pokemon = { id, name, height, weight, hp: st.hp, attack: st.attack, defense: st.defense, speed: st.speed, image, types };
        res.send({pokemon});
    }catch(error){
        var id = parseInt(id);
        var query = {where: {id: id}};
        var pokemon = await Pokemon.findAll({
            ...queryOptions,
            query,
            plain: true
        });
        if (pokemon) res.send({pokemon});
        else res.send({pokemon: null});
    }
});
/* esta ruta devuelve la información de todos los pokemons que hay en la base de datos y en la api. De cada pokemon trae los siguientes
campos: id, name, image y attack
*/
router.get('/pokemons', async (req, res)=>{
    var { name: pokemonName } = req.query;
    if (pokemonName == null || pokemonName == ""){
        if (pokemonsCache.length == 0){
            var {data: {results}} = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=40`);
            var pokemonsFromApi = await Promise.all(results.map(async ({url})=>{
                return await getPokemonMainData(url);
            }));
            pokemonsCache = pokemonsFromApi;
        }else{
            var pokemonsFromApi = pokemonsCache;
        }
        var pokemonsFromDb = await Pokemon.findAll({
            ...{attributes: ["id", "name", "image", "attack"]},
            ...queryOptions,
        });
        var pokemons = [...pokemonsFromDb, ...pokemonsFromApi];
        res.send({pokemons});    
    }else{
        try{
            var url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
            var pokemonFromApi = await getPokemonMainData(url);
            res.send({pokemons: [pokemonFromApi]})
        }catch(error){
            var query = {where: {name: pokemonName}};
            var pokemonFromDb = await Pokemon.findAll({
                ...{attributes: ["id", "name", "image", "attack"]},
                ...queryOptions,
                ...query,
                plain: true
            });
            res.send({pokemons: [pokemonFromDb]});
        }
    }        
});

/* A partir de la url de un pokemon devuelve un objeto con los siguientes campos:
name, image, types y attack */

async function getPokemonMainData(url) {
    var {
        data: { 
            sprites: { other: { dream_world: { front_default: image } } } ,
            types,
            stats,
            name,
            id
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
    var {data: {results}} = await axios.get("https://pokeapi.co/api/v2/type");
    var types = results.map(({name, url})=>{
        urlList = url.split("/");
        var id = urlList[urlList.length-2];
        return {name, id};
    });
    await Type.bulkCreate(types);
}

router.post("/pokemons", async (req, res)=>{
    if (await Type.count() === 0) await loadTypes();
    var {name, hp, attack, defense, speed, height, weight, types, image} = req.body;
    var pokemon = {name, hp, attack, defense, speed, height, weight, image};
    try{
        var newPokemon = await Pokemon.create(pokemon);
        if (types) {
            newPokemon = await newPokemon.addTypes(types);
        }
        res.send(newPokemon);
    }catch(error){
        var {errors: [{message: errorMessage}]} = error;
        res.send({error: errorMessage});
    }
});

router.get("/types", async (req, res)=>{
    if (await Type.count()===0) await loadTypes();
    var types = await Type.findAll();
    res.send(types); 
})


module.exports = router;
