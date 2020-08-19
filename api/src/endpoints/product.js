const apiValidation = require('../validation/api-validation');
const fileStore = require('../storage/file');
const mongoStore = require('../storage/mdb');
const multer = require('multer')({
  dest: 'scratch'
}); // warning: nginx location 40mb
const photoService = require('../media/photo');
const router = require('express').Router();

router.get('/:id', async (req, res) => {

  const { params, validationError } = await apiValidation.productGetById(req);

  if (validationError) {

    const params = apiValidation.fieldsFromValidationError(validationError);

    return res
      .status(500)
      .json({
        product: {
          error: {
            code: 'schema',
            params
          }
        }
      });
  }

  const product = await mongoStore.getProductById(params);
  return res.json({ product });
});

router.post('/', multer.array('photos', 8), async (req, res) => {

  const { body, files, validationError } = await apiValidation.productPost(req);

  if (validationError) {

    if (files && files.length) {
      for (const file of files) {
        await fileStore.delete(file.path);
      }
    }

    const fields = apiValidation.fieldsFromValidationError(validationError);

    return res
      .status(500)
      .json({
        product: {
          error: {
            code: 'schema',
            fields
          }
        }
      });
  }

  const photos = await photoService.saveFromFiles({ files });
  for (const file of files) {
    await fileStore.delete(file.path);
  }

  // TODO use proper handle, return something?
  await mongoStore.setProduct({ handle: 'chris' }, { ...body, photos });
  return res.json({ product: {} });
});

module.exports = router;