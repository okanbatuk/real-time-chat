const Joi = require("joi");

module.exports = {
  registerUser: {
    body: Joi.object({
      email: Joi.string().email().required(),
      fullName: Joi.string().max(128).required(),
      password: Joi.string().min(6).max(128).required(),
    }),
  },
  updateUserPassword: {
    body: Joi.object({
      currentPassword: Joi.string().min(6).max(128).required(),
      newPassword: Joi.string().min(6).max(128).required(),
    }),
  },
};
