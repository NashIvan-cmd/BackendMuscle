import { Request, Response, NextFunction } from "express";

export type ExpressHandle = (req: Request, res: Response, next: NextFunction) => any;