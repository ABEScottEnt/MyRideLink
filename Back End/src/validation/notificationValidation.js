const Joi = require('joi');

const sendNotification = Joi.object({
  type: Joi.string()
    .valid('RIDE_REQUEST', 'RIDE_ACCEPTED', 'RIDE_STARTED', 'RIDE_COMPLETED', 'PAYMENT_RECEIVED', 'SYSTEM')
    .required()
    .messages({
      'any.only': 'Invalid notification type',
      'any.required': 'Notification type is required'
    }),
  message: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.max': 'Message cannot exceed 500 characters',
      'any.required': 'Message is required'
    }),
  recipient_id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid recipient ID format',
      'any.required': 'Recipient ID is required'
    }),
  metadata: Joi.object()
    .pattern(Joi.string(), Joi.any())
    .default({})
    .messages({
      'object.base': 'Metadata must be an object'
    })
});

const updateNotificationPreferences = Joi.object({
  email_notifications: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Email notifications must be a boolean'
    }),
  push_notifications: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Push notifications must be a boolean'
    }),
  notification_types: Joi.object({
    RIDE_REQUEST: Joi.boolean().default(true),
    RIDE_ACCEPTED: Joi.boolean().default(true),
    RIDE_STARTED: Joi.boolean().default(true),
    RIDE_COMPLETED: Joi.boolean().default(true),
    PAYMENT_RECEIVED: Joi.boolean().default(true),
    SYSTEM: Joi.boolean().default(true)
  }).default()
});

module.exports = {
  sendNotification,
  updateNotificationPreferences
}; 