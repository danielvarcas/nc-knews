const topicsRouter = require('express').Router();

const { getTopics } = require('../controllers/topicsController.js');

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter;
