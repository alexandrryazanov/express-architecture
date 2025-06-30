import type { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { BadRequestError } from "../extensions/error.extension";

export function validateMiddleware(
  schema: ObjectSchema,
  module: string = "main",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (e) {
      throw new BadRequestError((e as any).message, module);
    }
  };
}
