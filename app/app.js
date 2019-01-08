const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/apiRouter');
const {
  handle400, handle404, handle422, handle500,
} = require('./errors/errorHandling');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use(handle400);
app.use(handle404);
app.use(handle422);
app.use(handle500);

module.exports = app;
