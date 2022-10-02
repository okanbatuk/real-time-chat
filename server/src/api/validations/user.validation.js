const Joi = require("joi");

module.exports = {
  updateUserPassword: {
    body: Joi.object({
      currentPassword: Joi.string().min(6).max(128).required(),
      newPassword: Joi.string().min(6).max(128).required(),
    }),
  },
  deleteValidation: {
    params: Joi.object({
      userId: Joi.string().min(12).max(256).required(),
    }),
  },
};
