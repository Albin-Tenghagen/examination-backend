import Joi from "joi";

const loginSchema = Joi.object({
  id: Joi.number(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

export async function validateLoginPayload(loginPayload) {
  return await loginSchema.validateAsync(loginPayload);
}
