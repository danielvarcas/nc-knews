exports.handle400 = (err, req, res, next) => {
  const codes = {
    23502: 'Invalid input: one or more required keys missing.',
    42703: 'Invalid input: one or more keys of sent object do not exist as columns in database.',
  };
  if (codes[err.code]) res.status(400).send({ message: codes[err.code] });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  const codes = {
    23503: 'Key is not present in table.',
  };
  if (codes[err.code]) res.status(404).send({ message: codes[err.code] });
  else next(err);
};

exports.handle405 = (req, res, next) => res.status(405).send({ message: 'Method Not Allowed' });

exports.handle422 = (err, req, res, next) => {
  const codes = {
    23505: 'Key ... already exists.',
  };
  if (codes[err.code]) res.status(422).send({ message: codes[err.code] });
  else next(err);
};
