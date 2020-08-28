const authService = require('../auth/auth');
const apiValidation = require('../validation/api-validation');
const emailService = require('../comms/email');
const fileStore = require('../storage/file');
const mongoStore = require('../storage/mdb');
const multer = require('multer')({
  dest: 'scratch'
}); // warning: nginx location 40mb
const photoService = require('../media/photo');
const router = require('express').Router();

router.post('/', multer.single('photo'), async (req, res) => {

  const { body, file, validationError } = await apiValidation.startPost(req);

  if (validationError) {

    if (file && file.path) {
      // TODO global error handler
      await fileStore.delete(file.path);
    }

    const fields = apiValidation.fieldsFromValidationError(validationError);

    // TODO error func/template
    return res
      .status(500)
      .json({
        start: {
          error: {
            code: 'schema',
            fields
          }
        }
      });
  }

  const userExists = await mongoStore.getUserExists(body);
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

    // TODO validation on payloads entering stores
    // TODO validation on payloads exiting via response
    // TODO shared file between API and UI with simple common constants
      // like handle regex
    await mongoStore.setUser({
      ...body,
      description: 'Hand-crafted cakes 🧁 pastries 🥧 and sweets 🍭',
      photo: { filename: 'chrisandrewca' }
    });

    await authService.setAuthSession(res, body);

    const photos = await photoService.saveFromFiles({ files: [file] });
    await mongoStore.setProduct({ ...body, photos });

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