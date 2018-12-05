process.env.NODE_ENV = 'test';
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');

const { handle422 } = require('./middleware/errorHandling');

app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use(handle422);
app.use((err, req, res, next) => {
  res.status(500).send(err);
});

module.exports = app;
