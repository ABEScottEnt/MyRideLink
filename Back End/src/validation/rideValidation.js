const Joi = require('joi');

const coordinates = Joi.object({
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      'number.base': 'Latitude must be a number',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required'
    }),
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      'number.base': 'Longitude must be a number',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required'
    })
});

const requestRide = Joi.object({
  origin: coordinates.required().messages({
    'any.required': 'Origin coordinates are required'
  }),
  destination: coordinates.required().messages({
    'any.required': 'Destination coordinates are required'
  }),
  vehicle_type: Joi.string()
    .valid('STANDARD', 'PREMIUM', 'LUXURY')
    .default('STANDARD')
    .messages({
      'any.only': 'Vehicle type must be one of: STANDARD, PREMIUM, LUXURY'
    }),
  payment_method: Joi.string()
    .valid('CARD', 'CASH')
    .required()
    .messages({
      'any.only': 'Payment method must be either CARD or CASH',
      'any.required': 'Payment method is required'
    })
});

const updateRideStatus = Joi.object({
  status: Joi.string()
    .valid('ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED')
    .required()
    .messages({
      'any.only': 'Status must be one of: ACCEPTED, STARTED, COMPLETED, CANCELLED',
      'any.required': 'Status is required'
    })
});

const rateRide = Joi.object({
  rating: Joi.number()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required'
    }),
  comment: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Comment cannot exceed 500 characters'
    })
});

module.exports = {
  requestRide,
  updateRideStatus,
  rateRide
}; 