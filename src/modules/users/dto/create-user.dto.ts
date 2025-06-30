import * as joi from "@hapi/joi";
import "joi-extract-type";

export const createUserDto = joi.object({
  name: joi.string().required(),
  age: joi.number().required(),
  email: joi.string().email().required(),
});

export type CreateUserDto = joi.extractType<typeof createUserDto>;
