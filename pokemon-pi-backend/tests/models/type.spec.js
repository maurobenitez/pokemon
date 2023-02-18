const { Pokemon, Type, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('type model', ()=>{
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', ()=>{
    beforeEach(() => Pokemon.sync({ force: true }));
    describe('id', ()=>{
      it('should throw an error if id is invalid', async ()=>{
        var errorMessage = "";
        try{
          await Type.create({})
        }catch(error){
          errorMessage = error.errors[0].message;
        }
        expect(errorMessage).to.be.equals("type.name cannot be null");
      });
    });
  });
});