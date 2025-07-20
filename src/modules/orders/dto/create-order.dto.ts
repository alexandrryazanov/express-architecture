import * as joi from "@hapi/joi";
import "joi-extract-type";

export const createOrderDto = joi
  .object({
    userId:       joi.number().required(),
    productName:  joi.string().required(),
    amount:       joi.number().required(),
  })
  .required();

export type CreateOrderDto = joi.extractType<typeof createOrderDto>;
