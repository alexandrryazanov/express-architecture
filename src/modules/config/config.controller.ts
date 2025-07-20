import { Controller } from "../../types/controller";
import { ConfigService } from "./config.service";

export class ConfigController extends Controller {
  constructor(private configService: ConfigService) {
    super("/config");
  }

  initRoutes() {
    this.router.post("/", (req, res) => {
      const result = this.configService.setConfig(req.body);
      res.send(result);
    });
    this.router.get("/", (req, res) => {
      const result = this.configService.getConfig();
      res.send(result);
    });
  }
}
