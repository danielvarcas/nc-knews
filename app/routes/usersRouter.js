const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/usersController');
const { handle405 } = require('../middleware/errorHandling');

usersRouter.route('/')
  .get(getUsers)
  .all(handle405);

usersRouter.route('/:user_id')
  .get(getUsers)
  .all(handle405);

module.exports = usersRouter;
