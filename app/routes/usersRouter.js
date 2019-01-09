const usersRouter = require('express').Router();
const { getUsers, getUserByUsername } = require('../controllers/usersController');
const { handle405 } = require('../errors/errorHandling');

usersRouter.route('/')
  .get(getUsers)
  .all(handle405);

usersRouter.route('/:username')
  .get(getUserByUsername)
  .all(handle405);

module.exports = usersRouter;
