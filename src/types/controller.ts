import { Router, Express } from "express";

export abstract class Controller {
  private readonly path: string;
  protected readonly router: Router;

  protected constructor(path: string) {
    this.path = path.startsWith("/") ? path : `/${path}`;
    this.router = Router();
  }

  protected abstract initRoutes(): void;

  public connect(app: Express) {
    this.initRoutes();
    app.use(this.path, this.router);
    console.log(`[ROUTER] Controller for ${this.path} is connected`);
  }
}
