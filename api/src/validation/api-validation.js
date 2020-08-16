const joi = require('joi');

const start = async (req) => {

  const schema = joi.object({
    body: joi.object({
      email: joi.string().required()
        .messages({ 'string.base': 'Your email is required.' }),
      handle: joi.string().required()
        .messages({ 'any.required': 'Your @handle is required.' }), // TODO @ + chars
      menuItemName: joi.string().required()
        .messages({ 'any.required': 'Your menu item is required.' }), // TODO chars
      price: joi.number().precision(2).greater(0).required()
        .messages({
          'number.precision': 'Your price must be like "4.99".',
          'number.greater': 'Your price must be greater than 0.',
          'any.required': 'Your price must be like "4.99".'
        })
    }).required(),
    file: joi.object({
      originalname: joi.string().required(),
      path: joi.string().required()
    }).required()
      .messages({ 'any.required': 'Your menu item photo is required.' })
  });

  try {
    await schema.validateAsync(req, { abortEarly: false, allowUnknown: true })
  } catch (error) {
    return { error };
  }

  return { body: req.body, file: req.file };
};

module.exports = {
  start
};