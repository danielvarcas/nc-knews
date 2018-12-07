process.env.NODE_ENV = 'test';
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const { handle400, handle404, handle422 } = require('./errors/errorHandling');

const app = express();

app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use(handle400);
app.use(handle404);
app.use(handle422);
app.use((err, req, res, next) => {
  res.status(500).send(err);
});

module.exports = app;
