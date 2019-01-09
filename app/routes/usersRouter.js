const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/usersController');
const { handle400, handle405 } = require('../errors/errorHandling');

usersRouter.route('/')
  .get(getUsers)
  .all(handle405);

// usersRouter.param('user_id', (req, res, next, id) => {
//   console.log('>>>>>>>>>>', id);
//   if (!Number.isInteger(Number(id))) handle400();
// });

// usersRouter.param();

usersRouter.route('/:user_id')
  .get(getUsers)
  .all(handle405);

module.exports = usersRouter;
