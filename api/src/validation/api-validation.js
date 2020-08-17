const joi = require('joi');

const start = async ({ body, file }) => {

  const schema = joi.object({
    body: joi.object({
      email: joi.string().regex(/^.+[@].+\..+$/).required()
        .label('email')
        .messages({
          'any.required': 'Your email is required.'
        }),
      handle: joi.string().required()
        .label('handle')
        .messages({
          'any.required': 'Your @handle is required.'
        }), // TODO @ + chars
      productName: joi.string().required()
        .label('productName')
        .messages({
          'any.required': 'Your menu item is required.'
        }), // TODO chars
      price: joi.number().precision(2).greater(0).required()
        .label('price')
        .messages({
          'number.precision': 'Your price must be like "4.99".',
          'number.greater': 'Your price must be greater than 0.',
          'any.required': 'Your price must be like "4.99".'
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
    return { validationError };
  }

  return { body, file };
};

module.exports = {
  start
};