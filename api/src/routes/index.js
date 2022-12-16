const { Router } = require('express');
const axios = require('axios');
const { Pokemon, Type, conn, Op} = require("../db.js");
const {extractFieldsFromPokemonData, getPokemonMainData, loadTypes, getDataFromUrl, getAllPokemonsFromDb, getPokemonFromDbById, getPokemonFromDbByName } = require("../helperFunctions");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

/* Ésta es una cache donde se guardan los pokemons */
var pokemonsFromApi = null;

router.get('/pokemons/:id', async ({params:{id}, session}, res)=>{
    try{
        var { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        var pokemon = extractFieldsFromPokemonData(data);
    }catch(error){
        var pokemonFromDb = await getPokemonFromDbById(parseInt(id));
        var pokemon = pokemonFromDb ? pokemonFromDb : null;
    }
    session.probando = "probando";
    res.send({pokemon});
});

router.get('/pokemons', async ({query: {name: pokemonName}}, res)=>{
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
            var pokemons = [getPokemonMainData(data)];
        }catch(error){
            var pokemonFromDb = await getPokemonFromDbByName(pokemonName);
            pokemons = pokemonFromDb ? [pokemonFromDb] : [];
        }
    }
    res.send({pokemons});
});

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
    var dbHasTypes = await Type.count();
    if (!dbHasTypes) await loadTypes();
    var types = await Type.findAll();
    res.send(types); 
})

module.exports = router;
