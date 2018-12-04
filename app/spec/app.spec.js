process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const { app } = require('../app');
const connection = require('../../db/connection');

describe('/api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  afterEach(() => connection.destroy());

  describe('/topics', () => {
    it('200 GET: responds with an array of topic objects', () => request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics[0]).to.have.all.keys('description', 'slug');
        expect(body.topics).to.have.length(2);
      }));
  });
});
