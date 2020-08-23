const apiValidation = require('../validation/api-validation');
const fileStore = require('../storage/file');
const mongoStore = require('../storage/mdb');
const multer = require('multer')({
  dest: 'scratch'
}); // warning: nginx location 40mb
const photoService = require('../media/photo');
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

  const userExists = await mongoStore.getUserExists(params);
  if (!userExists) {
    return res
      .status(500)
      .json({
        profile: {
          error: {
            code: 'handle',
            params: {
              handle: 'The handle doesn\'t exist.'
            }
          }
        }
      });
  }

  const products = await mongoStore.getProductsByHandle(params);
  const { description, photo } = await mongoStore.getUserByHandle(params);

  // TODO validate schemas going out
  return res.json({
    profile: { products, user: { description, photo } }
  });
});

router.patch('/', multer.array('photos', 1), async (req, res) => {

  const { body, files: [file], validationError } = await apiValidation.profilePatch(req);

  if (validationError) {

    if (file) {
      await fileStore.delete(file.path);
    }

    const fields = apiValidation.fieldsFromValidationError(validationError);

    return res
      .status(500)
      .json({
        profile: {
          error: {
            code: 'schema',
            fields
          }
        }
      });
  }

  const user = await mongoStore.getUserByHandle(body);

  if (!user) {
    return res
      .status(500)
      .json({
        profile: {
          error: {
            code: 'handle',
            params: {
              handle: 'The handle doesn\'t exist.'
            }
          }
        }
      });
  }

  if (file) {

    const [photo] = await photoService.saveFromFiles({ files: [file] });

    await fileStore.delete(file.path);

    // TODO move into photoService
    // warning: tied to assets for default profile image
    await fileStore.delete(`/var/www/media/${user.photo.filename}.webp`);
    await fileStore.delete(`/var/www/media/${user.photo.filename}.jpeg`);

    user.photo = photo;
  } else {

    // for existing files PATCHED as [object object]
    delete body.photo;
  }

  // TODO validate patch prior to saving to mongoStore
  await mongoStore.setUser({ ...user, ...body });

  return res.status(200).end();
});

module.exports = router;