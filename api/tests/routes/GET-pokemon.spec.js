/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, Type, conn } = require('../../src/db.js');

const agent = session(app);
const pokemon = {
  name: 'kkfkfkf',
};

describe('GET /pokemon route', () => {
  before(async () => {
    conn.authenticate()
  
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
  await conn.sync({ force: true })
  });

  it('should get valid height property', function(done){
    this.timeout(200000);
    
    agent.get('/pokemons').expect(200).end((req, res)=>{
      var pokemon = res.body.pokemons[0];
      expect(pokemon.name).to.equal("bulbasaur");
      done();
    });
  });

  it('should get pokemons from api and db', async function(){
    this.timeout(200000);
    await Pokemon.create(pokemon);
    var {_body: {pokemons}} = await agent.get('/pokemons').expect(200);
    expect(pokemons[0].name).to.equal('kkfkfkf');
  });

  it('should get one pokemon from api', async function (){
    this.timeout(70000);
    var {_body: {pokemons: pokemonFromApi}} = await agent.get('/pokemons?name=pikachu').expect(200);
    expect(pokemonFromApi[0].name).to.equal('pikachu');
  });

  it('should get one pokemon from db', async function(){
    this.timeout(70000);
    await Pokemon.create(pokemon);
    var {_body: {pokemons: pokemonFromDb}} = await agent.get('/pokemons?name=kkfkfkf').expect(200);
    expect(pokemonFromDb[0].name).to.equal('kkfkfkf');
  });
  
  it('should not get pokemon', function(done){
    this.timeout(70000);
    agent.get('/pokemons?name=ekek99k').expect(200).end((req, res)=>{
      var [lista] = res.body.pokemons;
      expect(lista).to.equal(null);
      done();
    })
  });
});
