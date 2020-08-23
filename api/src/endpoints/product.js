const apiValidation = require('../validation/api-validation');
const fileStore = require('../storage/file');
const mongoStore = require('../storage/mdb');
const multer = require('multer')({
  dest: 'scratch'
}); // warning: nginx location 40mb
const photoService = require('../media/photo');
const router = require('express').Router();

// TODO validate with auth session on these and others
router.delete('/', async (req, res) => {

  // TODO API validation
  const { id } = req.query;

  await mongoStore.deleteProductById({ id });

  return res.status(200).end();
});

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

router.patch('/', multer.array('photos', 8), async (req, res) => {

  const { body, files, validationError } = await apiValidation.productPatch(req);

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

  const product = await mongoStore.getProductById(body);

  if (!product) {

    return res
      .status(500)
      .json({
        product: {
          error: {
            code: 'id',
            field: {
              id: `Product with id ${id} doesn\'t exist.`
            }
          }
        }
      });
  }

  if (files && files.length) {

    const photos = await photoService.saveFromFiles({ files });

    for (const file of files) {
      await fileStore.delete(file.path);
    }

    // TODO move into photoService
    for (const productPhoto of product.photos) {
      await fileStore.delete(`/var/www/media/${productPhoto.filename}.webp`);
      await fileStore.delete(`/var/www/media/${productPhoto.filename}.jpeg`);
    }

    product.photos = photos;
  } else {

    // for existing files PATCHED as [object object]
    delete body.photos;
  }

  await mongoStore.setProduct({ ...product, ...body });

  return res.status(200).end();
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

  await mongoStore.setProduct({ ...body, photos });

  return res.status(200).end();
});

module.exports = router;