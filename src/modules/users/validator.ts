import Joi from "joi";

const validator = (schema: Joi.ObjectSchema) => (payload: object) =>
  schema.validate(payload, { abortEarly: false });

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

export const validateSignup = validator(signupSchema);
export const validateSignin = validator(signinSchema);
