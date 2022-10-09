/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, Type, conn } = require('../../src/db.js');

const agent = session(app);

describe('GET /types route', () => {
  before(async () => {
    conn.authenticate()
  
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
  await conn.sync({ force: true })
  });

  it('should get all elements', function(done){
    this.timeout(10000);
    agent.get('/types').expect(200).end((req, res)=>{
      var types = res.body;
      expect(types.length).to.equal(20);
      done();
    });
  });
});
