const { Router } = require('express');
const axios = require('axios');
const { Pokemon, Type, conn, Op} = require("../db.js");
const {extractFieldsFromPokemonData, queryOptions, getPokemonMainData, loadTypes } = require("../helperFunctions");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

var pokemonsCache = [];

router.get('/pokemons/:id', async (req, res)=>{
    try{
        var {id} = req.params;
        var { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        var pokemon = extractFieldsFromPokemonData(data);
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

router.get('/pokemons', async (req, res)=>{
    var { name: pokemonName } = req.query;
    if (pokemonName == null || pokemonName == ""){
        if (pokemonsCache.length == 0){
            var {data: {results}} = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=40`);
                var pokemonsFromApi = await Promise.all(results.map(async ({url})=>{
                    var connectionSuccess = false;
                    while (connectionSuccess === false){
                        try{
                            var pokemonData =  await getPokemonMainData(url);
                            connectionSuccess = true;
                            return pokemonData;
                        }catch(error){
                            console.log(`intento fallido con la url ${url}, reintentando`);
                        }
                    }
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
            /* var query = {where: {
                name: {
                  [Op.like]: `%${pokemonName}%`
                }
              }}; */
            var pokemonFromDb = await Pokemon.findAll({
                ...{attributes: ["id", "name", "image", "attack"]},
                ...queryOptions,
                ...query,
                plain: true
            });
            if (pokemonFromDb) res.send({pokemons: [pokemonFromDb]});
            else res.send({pokemons:[]});
        }
    }        
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
    if (await Type.count()===0) await loadTypes();
    var types = await Type.findAll();
    res.send(types); 
})


module.exports = router;
