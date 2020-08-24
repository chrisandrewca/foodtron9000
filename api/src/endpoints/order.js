const apiValidation = require('../validation/api-validation');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();

router.delete('/', async (req, res) => {

  let { orderSession } = req.scoped;
  orderSession.products = [];

  let validationError;
  ({ orderSession, validationError } =
    await apiValidation.orderSession({ orderSession }));

  if (validationError) {
    // TODO SRE error
  }

  await mongoStore.setOrderSession(orderSession);

  req.scoped.orderSession = orderSession;

  return res.json({ order: orderSession });
});

router.get('/', async (req, res) => {

  return res.json({ order: req.scoped.orderSession });
});

router.post('/', async (req, res) => {

  let { body, validationError} = await apiValidation.orderPost(req);

  if (validationError) {

    const fields = apiValidation.fieldsFromValidationError(orderPost.validationError);

    return res
      .status(500)
      .json({
        order: {
          error: {
            code: 'schema',
            fields
          }
        }
      });
  }

  let { orderSession } = req.scoped;
  orderSession.products.push(body);

  ({ orderSession, validationError } = await apiValidation.orderSession({ orderSession }));

  if (validationError) {
    // SRE error
  }

  await mongoStore.setOrderSession(orderSession);

  req.scoped.orderSession = orderSession;

  return res.status(200).end();
});

module.exports = router;