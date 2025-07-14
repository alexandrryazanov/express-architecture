import * as joi from "@hapi/joi";

export const createItemDto = joi.object({
  id: joi.number().required(),
  name: joi.string().required(),
});

export type CreateItemDto = joi.extractType<typeof createItemDto>;
