const apiValidation = require('../validation/api-validation');
const emailService = require('../comms/email');
const fileStore = require('../storage/file');
const mongoStore = require('../storage/mdb');
const multer = require('multer')({
  dest: 'scratch'
});
const router = require('express').Router();
const sharp = require('sharp');

router.post('/', multer.single('photo'), async (req, res) => {

  const { body, file, validationError } = await apiValidation.start(req);

  if (validationError) {
    if (file && file.path) {
      await fileUtils.delete(file.path);
    }

    const error = { code: 'schema', fields: {} };
    for (const detail of validationError.details) {
      error.fields[detail.context.label] = detail.message;
    }

    return res.json({ start: { error } });
  }

  // TODO delete image on all errors

  const userExists = await mongoStore.userExists(body);
  if (userExists) {
    if (userExists.email === body.email) {
      return res.json({
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
      return res.json({
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
    const { email, handle } = body;
    await emailService.sendStartEmail(body);
    await mongoStore.setUser(body, { email, handle });
    // const photo = await photos.savePhoto();
    // await db.setMenuItem();
    // await email.start();

    await fileStore.delete(file.path);
  } catch (startError) {
    console.log({ startError });
    return res.json({
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