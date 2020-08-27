const mongoStore = require('../storage/mdb');
const router = require('express').Router();

router.post('/', async (req, res) => {

  // TODO validate error with some type of signature prior to writing it to the store
  // TODO collect more info
  await mongoStore.setError({
    ...req.body,
    orderSessionId: req.scoped.orderSession.id
  });
});

module.exports = router;