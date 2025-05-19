import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("Request");

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const ip = req.ip || req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"];

    this.logger.log(`${method} ${originalUrl} - IP: ${ip} - UA: ${userAgent}`);
    next();
  }
}