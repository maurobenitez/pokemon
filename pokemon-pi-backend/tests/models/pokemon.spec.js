const { Pokemon, Type, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Pokemon model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Pokemon.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Pokemon.create({})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should work when its a valid name', () => {
        Pokemon.create({ name: 'Pikachu' });
      });
    });
    describe('id', ()=>{
      it('id number should auto increment', async ()=>{
        var pokemonA = await Pokemon.create({name: 'abc'});
        var pokemonB = await Pokemon.create({name: 'def'});
        expect(pokemonA.toJSON().id).to.be.equals(20003);
        expect(pokemonB.toJSON().id).to.be.equals(20004);
      });
    });
  });
});