const Joi = require('joi');

const processPayment = Joi.object({
  ride_id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid ride ID format',
      'any.required': 'Ride ID is required'
    }),
  amount: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be positive',
      'any.required': 'Amount is required'
    }),
  payment_method: Joi.string()
    .valid('CARD', 'CASH')
    .required()
    .messages({
      'any.only': 'Payment method must be either CARD or CASH',
      'any.required': 'Payment method is required'
    }),
  currency: Joi.string()
    .valid('USD', 'EUR', 'GBP')
    .default('USD')
    .messages({
      'any.only': 'Currency must be one of: USD, EUR, GBP'
    })
});

const addPaymentMethod = Joi.object({
  type: Joi.string()
    .valid('CREDIT_CARD', 'DEBIT_CARD')
    .required()
    .messages({
      'any.only': 'Payment type must be either CREDIT_CARD or DEBIT_CARD',
      'any.required': 'Payment type is required'
    }),
  card_number: Joi.string()
    .pattern(/^[0-9]{16}$/)
    .required()
    .messages({
      'string.pattern.base': 'Card number must be 16 digits',
      'any.required': 'Card number is required'
    }),
  expiry_month: Joi.number()
    .min(1)
    .max(12)
    .required()
    .messages({
      'number.base': 'Expiry month must be a number',
      'number.min': 'Expiry month must be between 1 and 12',
      'number.max': 'Expiry month must be between 1 and 12',
      'any.required': 'Expiry month is required'
    }),
  expiry_year: Joi.number()
    .min(new Date().getFullYear())
    .max(new Date().getFullYear() + 10)
    .required()
    .messages({
      'number.base': 'Expiry year must be a number',
      'number.min': 'Expiry year must be current year or later',
      'number.max': 'Expiry year cannot be more than 10 years in the future',
      'any.required': 'Expiry year is required'
    }),
  cvv: Joi.string()
    .pattern(/^[0-9]{3,4}$/)
    .required()
    .messages({
      'string.pattern.base': 'CVV must be 3 or 4 digits',
      'any.required': 'CVV is required'
    })
});

module.exports = {
  processPayment,
  addPaymentMethod
}; 