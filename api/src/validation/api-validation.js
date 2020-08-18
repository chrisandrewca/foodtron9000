const joi = require('joi');

// warning: this may expose errors for "internal" fields, leaking joi dependency
// for example see schema.validateAsync without allowUnknown
const fieldsFromValidationError = (validationError) => {
  const fields = {};
  for (const detail of validationError.details) {
    fields[detail.context.label] = detail.message;
  }
  return fields;
}

const productPost = async ({ files }) => {

  const schema = joi.object({
    files: joi.array().items(joi.object({
      filename: joi.string().required(),
      originalname: joi.string().required(),
      path: joi.string().required()
    })).required()
      .label('photos')
      .messages({
        'any.required': 'Your menu item photos are required.'
      })
  });

  try {
    await schema.validateAsync({ files }, { abortEarly: false, allowUnknown: true });
  } catch (validationError) {
    return { files, validationError };
  }

  return { files };
};

const profileGet = async ({ params }) => {

  const schema = joi.object({
    params: joi.object({
      handle: joi.string().required() // TODO handle syntax
        .label('handle')
        .messages({
          'any.required': 'Your handle is required.',
          'string.empty': 'Your handle is required.'
        })
    }).required()
  });

  try {
    await schema.validateAsync({ params }, { abortEarly: false });
  } catch (validationError) {
    return { params, validationError };
  }

  return { params };
};

const startPost = async ({ body, file }) => {

  // TODO message override for all cases when validation represents a value that must exist?
  const schema = joi.object({
    body: joi.object({
      email: joi.string().regex(/^.+[@].+\..+$/).required()
        .label('email')
        .messages({
          'any.required': 'Your email is required.',
          'string.empty': 'Your email is required.',
          'string.pattern.base': 'Your email is required.'
        }),
      handle: joi.string().required()
        .label('handle')
        .messages({
          'any.required': 'Your email is required.',
          'string.empty': 'Your @handle is required.'
        }), // TODO @ + chars
      productName: joi.string().required()
        .label('productName')
        .messages({
          'any.required': 'Your email is required.',
          'string.empty': 'Your menu item is required.'
        }), // TODO chars
      price: joi.number().precision(2).greater(0).required()
        .label('price')
        .messages({
          'number.precision': 'Your price must be like "4.99".',
          'number.greater': 'Your price must be greater than 0.',
          'any.required': 'Your price must be like "4.99".',
          'number.base': 'Your price must be like "4.99".'
        })
    }).required(),
    file: joi.object({
      filename: joi.string().required(),
      originalname: joi.string().required(),
      path: joi.string().required()
    }).required()
      .label('photo')
      .messages({
        'any.required': 'Your menu item photo is required.'
      })
  });

  try {
    await schema.validateAsync({ body, file }, { abortEarly: false, allowUnknown: true })
  } catch (validationError) {
    return { body, file, validationError };
  }

  return { body, file };
};

module.exports = {
  fieldsFromValidationError,
  productPost,
  profileGet,
  startPost
};