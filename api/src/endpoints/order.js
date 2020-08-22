const apiValidation = require('../validation/api-validation');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();

router.get('/', async (req, res) => {

  const { orderSession } = req.scoped;

  if (req.query.sessionId) {

    // TODO api validation on this mutation
    orderSession.products = [];

    await mongoStore.setOrderSession(orderSession, orderSession);

    req.scoped.orderSession = orderSession;
  }

  return res.json({ order: orderSession });
});

router.post('/', async (req, res) => {

  const { body, validationError } = await apiValidation.orderPost(req);

  if (validationError) {

    const fields = apiValidation.fieldsFromValidationError(validationError);

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

  const { orderSession } = req.scoped;

  orderSession.products.push(body);

  await apiValidation.orderSession({ orderSession });

  await mongoStore.setOrderSession(orderSession, orderSession);

  return res.status(200).end();
});

module.exports = router;