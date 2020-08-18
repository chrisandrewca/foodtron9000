const apiValidation = require('../validation/api-validation');
const fileStore = require('../storage/file');
const multer = require('multer')({
  dest: 'scratch'
}); // warning: nginx location 40mb
const photoService = require('../media/photo');
const router = require('express').Router();

router.post('/', multer.array('photos', 8), async (req, res) => {

  const { files, validationError } = await apiValidation.productPost(req);

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

  await photoService.saveFromFiles({ files });
  for (const file of files) {
    await fileStore.delete(file.path);
  }

  return res.json({ product: {} });
});

module.exports = router;