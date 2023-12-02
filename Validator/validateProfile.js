const Joi = require('joi');

const profileValidate = Joi.object({
    gender: Joi.string().valid("male", "female", "other").required().messages({
        'string.base': `gender must be a string`,
        'string.empty': `gender cannot be empty`,
        'string.valid': `gender only Admin or User`,
        'any.required': `gender is required`,
    }),
    contactNo: Joi.string().trim().required().messages({
        'string.base': `contactNo must be a string`,
        'string.empty': `contactNo cannot be empty`,
        'any.required': `contactNo  is required`,
    }),
    address: Joi.string().trim().required().messages({
        'string.base': `address must be a string`,
        'string.empty': `address cannot be empty`,
        'any.required': `address is required`,
    }),
    // Image: Joi.string().trim().required().messages({
    //     'string.base': `Image must be a string`,
    //     'string.empty': `Image cannot be empty`,
    //     'any.required': `Image is required`,
    // }),

})

module.exports = profileValidate