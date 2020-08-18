const apiValidation = require('../validation/api-validation');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();

router.get('/:handle', async (req, res) => {

  const { params, validationError } = await apiValidation.profileGet(req);

  if (validationError) {

    const params = apiValidation.fieldsFromValidationError(validationError);

    return res
      .status(500)
      .json({
        profile: {
          error: {
            code: 'schema',
            params
          }
        }
      });
  }

  const products = await mongoStore.listProductsByHandle(params);
  return res.json({ profile: { products } });
});

module.exports = router;