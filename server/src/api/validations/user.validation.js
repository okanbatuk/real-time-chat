const Joi = require("joi");

module.exports = {
  updateUserPassword: {
    body: Joi.object({
      currentPassword: Joi.string().min(6).max(128).required(),
      newPassword: Joi.string().min(6).max(128).required(),
    }),
  },
  paramsValidation: {
    params: Joi.object({
      userId: Joi.string()
        .min(12)
        .max(256)
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
