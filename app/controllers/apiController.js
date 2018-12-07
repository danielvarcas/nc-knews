const endpoints = require('../public/endpoints.json');

exports.getHome = (req, res, next) => {
  res.status(200).send(endpoints);
};
