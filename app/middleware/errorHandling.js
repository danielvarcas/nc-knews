exports.handle422 = (err, req, res, next) => {
  const codes = {
    23505: 'Key ... already exists.',
  };
  if (codes[err.code]) res.status(422).send({ msg: codes[err.code] });
};
