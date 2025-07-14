import * as joi from "@hapi/joi";
import "joi-extract-type";

export const createUserDto = joi
  .object({
    email: joi.string().email().required(),
    pwd: joi.string().required(),
  })
  .required();

export type CreateUserDto = joi.extractType<typeof createUserDto>;
