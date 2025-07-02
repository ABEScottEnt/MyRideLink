const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_PHONE_NUMBER: Joi.string().required(),
  FRONTEND_URL: Joi.string().uri().required(),
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  redisUrl: envVars.REDIS_URL,
  stripeSecretKey: envVars.STRIPE_SECRET_KEY,
  firebase: {
    projectId: envVars.FIREBASE_PROJECT_ID,
    clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
    privateKey: envVars.FIREBASE_PRIVATE_KEY,
  },
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
  },
  twilio: {
    accountSid: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN,
    phoneNumber: envVars.TWILIO_PHONE_NUMBER,
  },
  frontendUrl: envVars.FRONTEND_URL,
}; 