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

  it('serves JSON describing all available endpoints', () => request(app)
    .get('/api')
    .expect(200));

  it('405 - returns error 405 for other requests', () => request(app)
    .post('/api')
    .expect(405)
    .then(({ body }) => {
      expect(body.message).to.equal('Method Not Allowed');
    }));
  // END /API TESTS
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
    it('405 - returns error 405 for other requests', () => request(app)
      .put(pathToTopics)
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Method Not Allowed');
      }));
    // END /TOPICS TESTS
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
      it('405 - returns error 405 for other requests', () => request(app)
        .put('/api/topics/cats/articles')
        .expect(405)
        .then(({ body }) => {
          expect(body.message).to.equal('Method Not Allowed');
        }));
    });
    // END TOPICS/:ARTICLE_ID/ARTICLES TESTS
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
    it('405 - returns error 405 for other requests', () => request(app)
      .put('/api/articles')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Method Not Allowed');
      }));
    // END /ARTICLES TESTS
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

      it('200 PATCH - accepts an object which changes article\'s votes by newVote, then returns the updated article', () => {
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

      it('404 PATCH - returns error 404 if article does not exist', () => request(app)
        .patch('/api/articles/9999')
        .expect(404));

      it('200 DELETE - deletes an article by article_id and responds with an empty object', () => request(app)
        .delete('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql([]);
        })
        .then(() => request(app)
          .get('/api/articles?limit=100')
          .then(({ body }) => {
            expect(body.articles).to.have.length(11);
          })));
      it('405 - returns error 405 for other requests', () => request(app)
        .put('/api/articles/1')
        .expect(405)
        .then(({ body }) => {
          expect(body.message).to.equal('Method Not Allowed');
        }));
      // END ARTICLES/:ARTICLE_ID TESTS
      describe('/comments', () => {
        it('200 GET - responds with an array of comments for the given article_id', () => request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(10);
            expect(body.comments[0]).to.have.all.keys(
              'comment_id',
              'votes',
              'created_at',
              'author',
              'body',
            );
            expect(body.comments[0]).to.eql({
              comment_id: 2,
              votes: 14,
              created_at: '2016-11-22T00:00:00.000Z',
              author: 'butter_bridge',
              body:
                'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            });
          }));

        it('201 POST - accepts an object with a user_id and body and responds with the posted comment', () => {
          const newComment = {
            user_id: 1,
            body: 'Yayyyyyyyy :D',
          };
          return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
              expect(body.comment[0]).to.have.all.keys(
                'article_id',
                'comment_id',
                'votes',
                'created_at',
                'user_id',
                'body',
              );
            })
            .then(() => request(app)
              .get('/api/articles/1/comments?limit=100'))
            .then(({ body }) => {
              expect(body.comments).to.have.length(14);
            });
        });
        it('405 - returns error 405 for other requests', () => request(app)
          .put('/api/articles/1/comments')
          .expect(405)
          .then(({ body }) => {
            expect(body.message).to.equal('Method Not Allowed');
          }));
        // END ARTICLES/:ARTICLE_ID/COMMENTS TESTS
        describe('/:comment_id', () => {
          it('200 PATCH - accepts an object { inc_votes: newVote } and changes comment votes by newVote', () => {
            const aVote = { inc_votes: 4 };
            return request(app)
              .patch('/api/articles/1/comments/1')
              .send(aVote)
              .expect(200)
              .then(({ body }) => {
                expect(body.comment[0].votes).to.equal(20);
              });
          });

          it('200 DELETE - deletes comment by comment_id and returns an empty object', () => request(app)
            .delete('/api/articles/1/comments/2')
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({});
            })
            .then(() => request(app)
              .get('/api/articles/1/comments?limit=100')
              .then(({ body }) => {
                expect(body.comments).to.have.length(12);
              })));
          it('405 - returns error 405 for other requests', () => request(app)
            .put('/api/articles/1/comments/2')
            .expect(405)
            .then(({ body }) => {
              expect(body.message).to.equal('Method Not Allowed');
            }));
          // END ARTICLES/:ARTICLE_ID/COMMENTS/:COMMENT_ID TESTS
        });
      });
    });
  });
  describe('/users', () => {
    it('200 GET - responds with an array of user objects', () => request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).to.have.length(3);
        expect(body.users[0]).to.have.all.keys(
          'user_id',
          'username',
          'avatar_url',
          'name',
        );
      }));
    it('405 - returns error 405 for other requests', () => request(app)
      .put('/api/users')
      .expect(405)
      .then(({ body }) => {
        expect(body.message).to.equal('Method Not Allowed');
      }));
    // END USERS TESTS
    describe('/:user_id', () => {
      it('200 GET - responds with a user object', () => request(app)
        .get('/api/users/1')
        .expect(200)
        .then(({ body }) => {
          const user = body.users[0];
          expect(user).to.have.all.keys(
            'user_id', 'username', 'avatar_url', 'name',
          );
          expect(user.username).to.equal('butter_bridge');
        }));
      it('405 - returns error 405 for other requests', () => request(app)
        .put('/api/users/1')
        .expect(405)
        .then(({ body }) => {
          expect(body.message).to.equal('Method Not Allowed');
        }));
    });
    // END USERS/:USER_ID TESTS
  });
});
