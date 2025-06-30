import type { NextFunction, Request, Response } from "express";
import type { ServerError } from "../extensions/error.extension";

export function errorLoggerMiddleware(
  error: ServerError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Error occurred ", { error });
  next(error);
}
