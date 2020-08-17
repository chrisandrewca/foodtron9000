const apiValidation = require('../validation/api-validation');
const emailService = require('../comms/email');
const fileStore = require('../storage/file');
const mongoStore = require('../storage/mdb');
const multer = require('multer')({
  dest: 'scratch'
});
const photoService = require('../media/photo');
const router = require('express').Router();

router.post('/', multer.single('photo'), async (req, res) => {

  const { body, file, validationError } = await apiValidation.start(req);

  if (validationError) {
    if (file && file.path) {
      // TODO global error handler
      await fileStore.delete(file.path);
    }

    const fields = {};
    for (const detail of validationError.details) {
      fields[detail.context.label] = detail.message;
    }

    // TODO error func/template
    return res
      .status(500)
      .json({
        start: {
          code: 'schema',
          fields
        }
      });
  }

  const userExists = await mongoStore.userExists(body);
  if (userExists) {

    await fileStore.delete(file.path);

    if (userExists.email === body.email) {
      return res
        .status(500)
        .json({
          start: {
            error: {
              code: 'email',
              fields: {
                email: 'Welcome back! You\'re already signed up.'
              }
            }
          }
        });
    }

    if (userExists.handle === body.handle) {
      return res
        .status(500)
        .json({
          start: {
            error: {
              code: 'handle',
              fields: {
                handle: 'Sorry that @handle is taken.'
              }
            }
          }
        });
    }
  }

  try {
    await mongoStore.setUser(body, body);

    const photos = await photoService.saveFromFiles({ files: [file] });
    await mongoStore.setProduct(body, { ...body, photos });

    await emailService.sendStartEmail(body);

    await fileStore.delete(file.path);

  } catch (startError) {
    console.log({ startError });

    // TODO global error handler
    await fileStore.delete(file.path);

    return res
      .status(500)
      .json({
        start: {
          error: {
            code: 'internal'
          }
        }
      });
  }

  return res.status(200).end();
});

module.exports = router;