import type { NextFunction, Request, Response } from "express";
import type { ServerError } from "../extensions/error.extension";

export function errorMiddleware(
  error: ServerError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res
    .status(error.statusCode)
    .send({ message: error.message, details: error.details });
  return;
}
