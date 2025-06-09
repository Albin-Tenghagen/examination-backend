import Joi from "joi";

const notesSchema = Joi.object({
  id: Joi.number(),
  user_id: Joi.number().required(),
  title: Joi.string().required(),
  text: Joi.string().required(),
  created_at: Joi.string(),
  modified_at: Joi.string(),
}).options({ abortEarly: false });

export async function validateNotePayload(notePayload) {
  return await notesSchema.validateAsync(notePayload);
}
