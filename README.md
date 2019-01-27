# Northcoders News API

An API built to use with [NC News](https://github.com/danielvarcas/nc-news), a social news 'Reddit-clone' site. The API handles user, article, topic and comment data.

### Deployed app

- https://dashboard.heroku.com/apps/dv-knews


### Installing

```
git clone https://github.com/danielvarcas/nc-knews.git
cd nc-knews
npm install
npm start
```

## Running the tests

```
npm test
```

## API description

- Each topic has:

  - `slug` field which is a unique string that acts as the table's primary key
  - `description` field which is a string giving a brief description of a given topic

- Each user has:

  - `user_id` which is the primary key
  - `username`
  - `avatar_url`
  - `name`

- Each article has:
  - `article_id` which is the primary key
  - `title`
  - `body`
  - `votes` defaults to 0
  - `topic` field which references the slug in the topics table
  - `user_id` field that references a user's primary key.
  - `created_at` defaults to the current date

* Each comment has:
  - `comment_id` which is the primary key
  - `user_id` field that references a user's primary key
  - `article_id` field that references an article's primary key
  - `votes` defaults to 0
  - `created_at` defaults to the current date
  - `body`


### Routes

The server has the following end-points:

```http
GET /api/topics
```

- responds with an array of topic objects - each object has a `slug` and `description` property.

```http
POST /api/topics
```

- accepts an object containing `slug` and `description` property, the `slug` must be unique
- responds with the posted topic object

```http
GET /api/topics/:topic/articles
```

- responds with an array of article objects for a given topic
- each article has:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `votes`
  - `comment_count` which is the accumulated count of all the comments with this article_id.
  - `created_at`
  - `topic`

Queries

- This route accepts the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `sort_ascending`, when "true" returns the results sorted in ascending order (defaults to descending)


```http
POST /api/topics/:topic/articles
```

- accepts an object containing a `title` , `body` and a `user_id` property
- responds with the posted article

```http
GET /api/articles
```

- responds with an array of article objects
- each article has:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `votes`
  - `comment_count` which is the accumulated count of all the comments with this article_id.
  - `created_at`
  - `topic`

Queries

- This route accepts the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `sort_ascending`, when "true" returns the results sorted in ascending order (defaults to descending)


```http
GET /api/articles/:article_id
```

- responds with an article object
- each article has:
  - `article_id`
  - `author` which is the `username` from the users table,
  - `title`
  - `votes`
  - `body`
  - `comment_count` which is the count of all the comments with this article_id. A particular SQL clause is useful for this job!
  - `created_at`
  - `topic`

```http
PATCH /api/articles/:article_id
```

- accepts an object in the form `{ inc_votes: newVote }`
  - `newVote` indicates how much the `votes` property in the database should be updated by
    E.g `{ inc_votes : 1 }` would increment the current article's vote property by 1
    `{ inc_votes : -100 }` would decrement the current article's vote property by 100

```http
DELETE /api/articles/:article_id
```

- deletes the given article by `article_id`
- responds with an empty object

```http
GET /api/articles/:article_id/comments
```

- responds with an array of comments for the given `article_id`
- each comment has
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

Queries

- This route accepts the following queries:

* limit, which limits the number of responses (defaults to 10)
* sort_by, which sorts the articles by any valid column (defaults to date)
* p, stands for page which specifies the page at which to start (calculated using limit)
* sort_ascending, when "true" returns the results sorted in ascending order (defaults to descending)

```http
POST /api/articles/:article_id/comments
```

- accepts an object with a `user_id` and `body`
- responds with the posted comment

```http
PATCH /api/articles/:article_id/comments/:comment_id
```

- accepts an object in the form `{ inc_votes: newVote }`
  - `newVote` will indicate how much the `votes` property in the database should be updated by
    E.g `{ inc_votes : 1 }` would increment the current article's vote property by 1
    `{ inc_votes : -1 }` would decrement the current article's vote property by 1

```http
DELETE /api/articles/:article_id/comments/:comment_id
```

- deletes the given comment by `comment_id`
- responds with an empty object

```http
GET /api/users
```

- responds with an array of user objects
- each user object has
  - `user_id`
  - `username`
  - `avatar_url`
  - `name`

```http
GET /api/users/:user_id
```

- responds with a user object
- each user has
  - `user_id`
  - `username`
  - `avatar_url`
  - `name`

```http
GET /api
```

- Serves JSON describing all the available endpoints on the API

## Built With

* [bodyparser](https://www.npmjs.com/package/body-parser)
* [chai](https://www.npmjs.com/package/chai)
* [cors](https://www.npmjs.com/package/cors)
* [express](https://www.npmjs.com/package/express)
* [knex.js](https://www.npmjs.com/package/knex)
* [mocha](https://www.npmjs.com/package/mocha)
* [pg-promise](https://www.npmjs.com/package/pg-promise)
* [SuperTest](https://www.npmjs.com/package/supertest)

## Authors

* **Daniel Varcas** - [Daniel Varcas](https://github.com/danielvarcas)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
