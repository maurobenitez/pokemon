const { Router } = require('express');
const router = Router();
const {getPokemonById, createPokemon, getAllPokemons} = require("../controllers/pokemonsController");

router.get('/:id', async ({params:{id}}, res)=>{
    try{
        var pokemon = await getPokemonById(id);
        res.json({pokemon});
    }catch(error){
        res.status(404).send({error: error.message});
    }
});

router.get('/', async ({query: {name: pokemonName}}, res)=>{
    try{
        var pokemons = await getAllPokemons(pokemonName);
        res.send(pokemons);
    }catch(error){
        res.status(404).send(error.message);
    }
});

router.post("/", async (req, res)=>{
    try{
        var pokemon = await createPokemon(req.body);
        res.send(pokemon);
    }catch(error){
        res.send({error: "name must be unique"});
    }
});

module.exports = router;