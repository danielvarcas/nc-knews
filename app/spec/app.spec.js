process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const { app } = require('../app');
const connection = require('../../db/connection');

describe('/api', () => {
  after(() => connection.destroy());
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));

  describe('/topics', () => {
    const pathToTopics = '/api/topics';
    it('200 GET: responds with an array of topic objects', () => request(app)
      .get(pathToTopics)
      .expect(200)
      .then(({ body }) => {
        expect(body.topics[0]).to.have.all.keys('description', 'slug');
        expect(body.topics).to.have.length(2);
      }));
    // 405
    it('201 POST: accepts an object containing slug and description and responds with posted topic object', () => {
      const newTopic = {
        description: 'A Coding Education Like No Other',
        slug: 'northcoders',
      };
      return request(app)
        .post(pathToTopics)
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          console.log('>>>>', body, '<<<<');
          expect(body.newTopic[0]).to.have.all.keys('description', 'slug');
        })
        .then(() => request(app)
          .get(pathToTopics))
        .then(({ body }) => {
          expect(body.topics).to.have.length(3);
        });
    });
  });
});
