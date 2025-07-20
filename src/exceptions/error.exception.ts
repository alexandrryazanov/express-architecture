export class ServerError extends Error {
  constructor(
    message: string,
    public details: string = "Unknown error",
    public statusCode: number = 500,
    public module: string = "main",
  ) {
    super(message);
  }
}

export class NotFoundError extends ServerError {
  constructor(details: string, module: string = "main") {
    super("Not found", details, 404, module);
  }
}

export class BadRequestError extends ServerError {
  constructor(details: string, module: string = "main") {
    super("Bad request", details, 400, module);
  }
}
