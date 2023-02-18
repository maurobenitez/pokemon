const { Router } = require('express');
const router = Router();

const types = require ("./types")
const pokemons = require("./pokemons")


router.use('/types', types);
router.use('/pokemons', pokemons);

module.exports = router;