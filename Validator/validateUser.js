const Joi = require('joi');

const userValidate = Joi.object({
    email: Joi.string().trim().required().email().messages({
        'string.base': `Email must be a string`,
        'string.empty': `Email cannot be empty`,
        'string.email': `Email must be a valid email address`,
        'any.required': `Email is required`,
      }),
      name: Joi.string().trim().required().min(8).max(255).messages({
        'string.base': `Name must be a string`,
        'string.empty': `Name cannot be empty`,
        'string.min': `Name should have a minimum length of {#limit}`,
        'string.max': `Name should have a maximum length of {#limit}`,
        'any.required': `Name is required`,
      }),
})

module.exports = userValidate