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

const orderPost = async ({ body }) => {

  const schema = joi.object({
    body: joi.object({ // TODO duplicate between orderPost/orderSession
      id: joi.string().uuid({ version: "uuidv4" }).required()
        .label('id')
        .messages({
          'any.required': 'Your product ID is required.',
          'string.empty': 'Your product ID is required.'
        }),
      note: joi.string().required()
        .label('note')
        .messages({
          'any.required': 'Your note is required.',
          'string.empty': 'Your note is required.',
        }),
      quantity: joi.number().precision(0).greater(0).required()
        .label('quantity')
        .messages({
          'number.precision': 'Your quantity must be like "3".',
          'number.greater': 'Your quantity must be greater than 0.',
          'any.required': 'Your quantity must be like "3".',
          'number.base': 'Your quantity must be like "3".'
        })
    }).required()
  });

  try {
    await schema.validateAsync({ body }, { abortEarly: false });
  } catch (validationError) {
    return { body, validationError };
  }

  return { body };
};

const orderSession = async ({ orderSession }) => {

  const schema = joi.object({
    orderSession: joi.object({
      id: joi.string().uuid({ version: "uuidv4" }).required()
        .label('id')
        .messages({
          'any.required': 'Your product ID is required.',
          'string.empty': 'Your product ID is required.'
        }),
      // TODO duplicate between orderPost/orderSession
      products: joi.array().items(joi.object({
        id: joi.string().uuid({ version: "uuidv4" }).required()
          .label('id')
          .messages({
            'any.required': 'Your product ID is required.',
            'string.empty': 'Your product ID is required.'
          }),
        note: joi.string().required()
          .label('note')
          .messages({
            'any.required': 'Your note is required.',
            'string.empty': 'Your note is required.',
          }),
        quantity: joi.number().precision(0).greater(0).required()
          .label('quantity')
          .messages({
            'number.precision': 'Your quantity must be like "3".',
            'number.greater': 'Your quantity must be greater than 0.',
            'any.required': 'Your quantity must be like "3".',
            'number.base': 'Your quantity must be like "3".'
          })
      })).required()
        .label('products')
        .messages({
          'any.required': 'Your menu item photos are required.'
        })
    })
  });

  try {
    await schema.validateAsync({ orderSession }, { abortEarly: false })
  } catch (validationError) {
    return { orderSession, validationError };
  }

  return { orderSession };
};

const productGetById = async ({ params }) => {

  const schema = joi.object({
    params: joi.object({
      id: joi.string().uuid({ version: "uuidv4" }).required()
        .label('id')
        .messages({
          'any.required': 'Your product ID is required.',
          'string.empty': 'Your product ID is required.'
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

const productPost = async ({ body, files }) => {

  const schema = joi.object({
    body: joi.object({
      description: joi.string().required()
        .label('description')
        .messages({
          'any.required': 'Your description is required.',
          'string.empty': 'Your description is required.',
        }),
      name: joi.string().required()
        .label('name')
        .messages({
          'any.required': 'Your name is required.',
          'string.empty': 'Your name is required.',
        }),
      price: joi.number().precision(2).greater(0).required()
        .label('price')
        .messages({
          'number.precision': 'Your price must be like "4.99".',
          'number.greater': 'Your price must be greater than 0.',
          'any.required': 'Your price must be like "4.99".',
          'number.base': 'Your price must be like "4.99".'
        })
    }).required(),
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
    await schema.validateAsync({ body, files }, { abortEarly: false, allowUnknown: true });
  } catch (validationError) {
    return { body, files, validationError };
  }

  return { body, files };
};

const profileGet = async ({ params }) => {

  const schema = joi.object({
    params: joi.object({
      handle: joi.string().pattern(/^[A-Za-z-_~]+$/).required()
        .label('handle')
        .messages({
          'any.required': 'Your @handle is required.',
          'string.empty': 'Your @handle is required.',
          'string.pattern.base': 'Your @handle is required.'
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
      handle: joi.string().pattern(/^[A-Za-z-_~]+$/).required()
        .label('handle')
        .messages({
          'any.required': 'Your @handle is required.',
          'string.empty': 'Your @handle is required.',
          'string.pattern.base': 'Your @handle is required.'
        }),
      name: joi.string().required()
        .label('name')
        .messages({
          'any.required': 'Your menu item is required.',
          'string.empty': 'Your menu item is required.'
        }),
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
  orderPost,
  orderSession,
  productGetById,
  productPost,
  profileGet,
  startPost
};