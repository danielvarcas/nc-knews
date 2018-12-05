process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
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
          expect(body.newTopic[0]).to.have.all.keys('description', 'slug');
        })
        .then(() => request(app)
          .get(pathToTopics))
        .then(({ body }) => {
          expect(body.topics).to.have.length(3);
        });
    });
    it('422 POST - rejects objects where slug (pkey) already exists in database', () => {
      const newTopic = {
        description: 'meow',
        slug: 'cats',
      };
      return request(app)
        .post(pathToTopics)
        .send(newTopic)
        .expect(422);
    });

    describe('/:topic/articles', () => {
      it('200 GET - responds with an array of article objects for a given object with defaulted queries available', () => request(app)
        .get(`${pathToTopics}/mitch/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic');
          expect(body.articles).to.have.length(10);
        }));
    });
  });
});
