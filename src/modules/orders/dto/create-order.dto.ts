import * as joi from "@hapi/joi";
import "joi-extract-type";

export const createOrderDto = joi
  .object({
    userId: joi.number().required(),
    itemIds: joi.array().items(joi.number().required()).required(),
  })
  .required();

export type CreateOrderDto = joi.extractType<typeof createOrderDto>;
