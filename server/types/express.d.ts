import { Request } from "express";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      auth?: any;
    }
  }
}

export type Controller = (
  req: Request,
  res: Response,
) => Promise<Response | void>;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>;
