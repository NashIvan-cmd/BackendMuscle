import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type ExpressHandle = (req: Request, res: Response, next: NextFunction) => any;

// type is used for aliasing a union
export type Decoded = string | jwt.JwtPayload | null;