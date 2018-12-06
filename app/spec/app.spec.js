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
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.have.all.keys(
            'author',
            'title',
            'article_id',
            'votes',
            'comment_count',
            'created_at',
            'topic',
          );
          expect(body.articles).to.have.length(10);
        }));

      it('200 GET - returns an empty array if no articles found (including if topic does not exist)', () => request(app)
        .get('/api/topics/existential_crises/articles')
        .expect(200)
        .then(({ body }) => expect(body.articles).to.eql([])));

      it('201 POST - accepts an object containing a title, body and user_id and responds with posted article', () => {
        const anArticle = {
          title: 'Hello world',
          body: 'How are you?',
          user_id: 1,
        };
        return request(app)
          .post('/api/topics/cats/articles')
          .send(anArticle)
          .expect(201)
          .then(({ body }) => {
            const { article } = body;
            expect(article).to.have.all.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'user_id',
              'created_at',
            );
            expect(article.title).to.equal('Hello world');
            expect(article.body).to.equal('How are you?');
          });
      });

      it('404 POST - rejects a new post if topic does not exist', () => {
        const anArticle = {
          title: 'The first rule of Fight Club...',
          body: 'You do not talk about Fight Club.',
          user_id: 1,
        };
        return request(app)
          .post('/api/topics/fightclub/articles')
          .send(anArticle)
          .expect(404);
      });
    });
  });

  describe('/articles', () => {
    it('200 GET - responds with an array of article objects with defaulted queries', () => request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).to.have.length(10);
        expect(articles[0]).to.have.all.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'comment_count',
          'created_at',
          'topic',
        );
      }));

    describe('/:article_id', () => {
      it('200 GET - responds with an article object', () => request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(1);
          const article = body.articles[0];
          expect(article).to.have.all.keys(
            'article_id',
            'author',
            'title',
            'votes',
            'body',
            'comment_count',
            'created_at',
            'topic',
          );
          expect(article.author).to.equal('butter_bridge');
          expect(article.votes).to.equal(100);
        }));
      it('200 GET - responds with an empty array if article_id does not exist in database', () => request(app)
        .get('/api/articles/9999')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([]);
        }));

      it.only('200 PATCH - accepts an object which changes article\'s votes by newVote, then returns the updated article', () => {
        const aVote = { inc_votes: 10 };
        return request(app)
          .patch('/api/articles/1')
          .send(aVote)
          .expect(200)
          .then(({ body }) => {
            const article = body.article[0];
            expect(article.votes).to.equal(110);
          });
      });
    });
  });
});
