import jwt from "jsonwebtoken"

export interface DecodedPayload extends jwt.JwtPayload {
    userId: string;
    role: string;
}