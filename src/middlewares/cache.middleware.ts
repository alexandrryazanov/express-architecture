import type { NextFunction, Request, Response } from "express";
import type { RedisService } from "../modules/redis/redis.services";

export const cacheMiddleware = (redisService: RedisService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" || !redisService) return next();

    const redisData = await redisService.client.get(req.originalUrl);
    if (redisData) {
      res.header("redis-cached", "true");
      res.header("Content-Type", "application/json");
      res.status(200).send(JSON.parse(redisData));
      console.log("[REDIS] Sent response from cache for", req.originalUrl);
      return;
    }

    const oldSendMethod = res.send;

    res.send = (body) => {
      if (res.statusCode < 400) {
        redisService.client
          .set(req.originalUrl, JSON.stringify(body))
          .then(() => {
            console.log("[REDIS] Set redis cache for", req.originalUrl);
          });
      }
      res.send = oldSendMethod;
      return res.send(body);
    };

    next();
  };
};
