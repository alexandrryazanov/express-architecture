import type { NextFunction, Request, Response } from "express";
import * as joi from "@hapi/joi";
import { BadRequestError } from "../extensions/error.extension";

export function validateMiddleware(
  schema: joi.BoxObjectSchema<any>,
  module: string = "main",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.message, module);
    next();
  };
}
