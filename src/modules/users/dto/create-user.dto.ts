import joi, { type ObjectSchema } from "joi";

export interface CreateUserDto {
  name: string;
  age: number;
  email: string;
}

export const userCreateSchema: ObjectSchema<CreateUserDto> = joi.object({
  name: joi.string().required(),
  age: joi.number().required(),
  email: joi.string().email().required(),
});
