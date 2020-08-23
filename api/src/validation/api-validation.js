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

// TODO splitup validation for patches which require photos
  // since UI will send over photo field with '[object object]' string
  // from - allowUnknown for multer files
const productPatch = async ({ body, files }) => {

  const schema = joi.object({
    body: joi.object({
      description: joi.string().required()
        .label('description')
        .messages({
          'any.required': 'Your description is required.',
          'string.empty': 'Your description is required.',
        }),
      id: joi.string().uuid({ version: 'uuidv4' }).required()
        .label('id')
        .messages({
          'any.required': 'Your id is required.',
          'string.empty': 'Your id is required.',
          'string.uuid.base': 'Your id is required.'
        }),
      name: joi.string().required()
        .label('name')
        .messages({
          'any.required': 'Your menu item name is required.',
          'string.empty': 'Your menu item name is required.',
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
    })) // TODO possibly support .min(1), so we dont get an empty files array?
  });

  try {
    await schema.validateAsync({ body, files }, { abortEarly: false, allowUnknown: true });
  } catch (validationError) {
    return { body, files, validationError };
  }

  return { body, files };
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
      handle: joi.string().pattern(/^[A-Za-z0-9-_~]+$/).required()
        .label('handle')
        .messages({
          'any.required': 'Your @handle is required.',
          'string.empty': 'Your @handle is required.',
          'string.pattern.base': 'Your @handle is required.'
        }),
      name: joi.string().required()
        .label('name')
        .messages({
          'any.required': 'Your menu item name is required.',
          'string.empty': 'Your menu item name is required.',
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
    })).min(1)
      .required()
      .label('photos')
      .messages({
        'any.required': 'Your menu item photos are required.',
        'array.min': 'Your menu item photos are required.'
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
      handle: joi.string().pattern(/^[A-Za-z0-9-_~]+$/).required()
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

// TODO splitup validation for patches which require photos
  // since UI will send over photo field with '[object object]' string
  // from - allowUnknown for multer files
const profilePatch = async ({ body, files }) => {

  const schema = joi.object({
    body: joi.object({
      description: joi.string().required()
        .label('description')
        .messages({
          'any.required': 'Your description is required.',
          'string.empty': 'Your description is required.',
        }),
      handle: joi.string().pattern(/^[A-Za-z0-9-_~]+$/).required()
        .label('handle')
        .messages({
          'any.required': 'Your @handle is required.',
          'string.empty': 'Your @handle is required.',
          'string.pattern.base': 'Your @handle is required.'
        })
    }).required(),
    files: joi.array().items(joi.object({
      filename: joi.string().required(),
      originalname: joi.string().required(),
      path: joi.string().required()
    })) // TODO possibly support .min(1), so we dont get an empty files array?
  });

  try {
    await schema.validateAsync({ body, files }, { abortEarly: false, allowUnknown: true });
  } catch (validationError) {
    return { body, files, validationError };
  }

  return { body, files };
};

const startPost = async ({ body, file }) => {

  // TODO message override for all cases when validation represents a value that must exist?
  const schema = joi.object({
    body: joi.object({
      email: joi.string().pattern(/^.+[@].+\..+$/).required()
        .label('email')
        .messages({
          'any.required': 'Your email is required.',
          'string.empty': 'Your email is required.',
          'string.pattern.base': 'Your email is required.'
        }),
      handle: joi.string().pattern(/^[A-Za-z0-9-_~]+$/).required()
        .label('handle')
        .messages({
          'any.required': 'Your @handle can only include alphabet, numbers, and - ~ _',
          'string.empty': 'Your @handle can only include alphabet, numbers, and - ~ _',
          'string.pattern.base': 'Your @handle can only include alphabet, numbers, and - ~ _'
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
  productPatch,
  productPost,
  profileGet,
  profilePatch,
  startPost
};