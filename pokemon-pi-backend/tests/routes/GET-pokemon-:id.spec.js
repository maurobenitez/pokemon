/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, Type, conn } = require('../../src/db.js');

const agent = session(app);

const pokemon = {
  name: 'kkfkfkf',
};

describe('GET /pokemon/:id route', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  it('Pokemon from api found', function(done){
    this.timeout(70000);
    agent.get('/pokemons/1').expect(200).end((req, res)=>{
      let pokemon = res.body.pokemon;
      expect(pokemon.name).to.equal("bulbasaur");
      done();
    });
  });
  it('Pokemon from api not found', function(done){
    this.timeout(7000);
    agent.get('/pokemons/40000').expect(200).end((req, res)=>{
      var list = res.body.pokemon;
      expect(list).to.equal(null);
      done();
    })
  });
  it('pokemon from db found', async function(){
    await Pokemon.create(pokemon);
    var {_body: body}  = await agent.get('/pokemons/2005').expect(200);
    expect(body.pokemon.id).to.equal(20005);
  })
});
