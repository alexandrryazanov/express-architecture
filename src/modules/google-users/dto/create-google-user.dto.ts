import * as joi from "@hapi/joi";
import "joi-extract-type";

export const createGoogleUserDto = joi
  .object({
    name: joi.string().required(),
    userIds: joi.array().items(joi.number()).required(),
  })
  .required();

export type CreateGoogleUserDto = joi.extractType<typeof createGoogleUserDto>;