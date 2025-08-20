// Auth middleware for handling authentication and authrization
// Such as JWT verificaition, role checks and more

/*
    header.payload.signature

    // If not specified header is automatically given RS256
    { this header tells what is the algorithm use and its type
        "alg": "HS256", RS256
        "typ": "JWT"
    }
    
    { payload contains claim. Who am I? my Id and my role
        "id": 123,
        "username": "JohnDoe",
        "role": "admin",
        "exp": 1699999999
    }

    Last part is signature 
    Created by taking the encoded header + encoded payload, hashing them with the secret key and the chosen algorithm.
    Allows the server to check if the token has not been altered

    (Optional)
    aud: Can issue the intended recipient of the token so it will not be misused e.g (Billing Token cannot be used to User API)
    iss: This is about the token issuer (Helps to make sure that the token came from the right issuer)

    * Errors
        TokenExpiredError
            - Automatically thrown if token is expires during verify()
        JsonWebTokenError
            - more like general error handler with lot of options for message
        NotBeforeError
            - Thrown if current time is before nbf claim

    
    #### Where to store access token
    - Big systems or Sensitive data (Use Redis) - Stateful approach
    - Small app (Use Cookies/HTTP) - Stateless Approach

    W/ React
    - Store access token in useState
*/

import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "./error.middleware";
import { redisClient } from "../configs/redis.connect";
import { daysToSeconds } from "../utils/time.utils";
import { Decoded } from "../utils/fnType.utils";
import { DecodedPayload } from "../utils/fnInterface.utils";


const { JsonWebTokenError, TokenExpiredError } = jwt;

dotenv.config();
const secretAccT = process.env.JWT_AT_SECRET;
const secretRefT = process.env.JWT_RT_SECRET;


export const genAccessToken = (userId: string, role: string): string => {
    if (!secretAccT) throw new Error("Missing Secret String");
    // console.log({ secretAccT });
    
    // { username: username, role: role } = CLAIMS
    // Claims like username or ID makes it an ID token
    // It is better to put object ID than PII in a token
    // secretAccT = Signature
    const accessToken = jwt.sign({ userId: userId, role: role }, secretAccT, { expiresIn: '3m' });

    return accessToken;
}

export const decodeToken = (cookieData: string) => {
    try {
        let token: string;
        token = cookieData.split("=")[1];

        const decoded = jwt.decode(token) as DecodedPayload;
        console.log("Decoded Val: ", decoded);

        return decoded;
    } catch (error) {
        throw error;
    }
}

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const cookieData = req.headers.cookie;
    console.log(cookieData);

    let decoded;
    let token: string | undefined;
    try {
        /* "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            split method stores it into array and it becomes
            ["Bearer", "eyJhbG..."]
        */

        if (!cookieData) throw new UnauthorizedError({ code: 401, message: "Missing Token" });
        token = cookieData.split('=')[1];

        // console.log({ token });

        if (!token) throw new UnauthorizedError({ code: 401, message: "Token Missing" });
        if (!secretAccT) throw new Error("Missing Error String");

        decoded = jwt.decode(token) as DecodedPayload | null;
        console.log("Decoded Val", decoded);

        jwt.verify(token, secretAccT);
        
        // Attaching decoded claims (makes it available downstream)
        res.locals.user = decoded;
        
        // Calling next proceeds to the next middleware
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError && decoded) {
            console.log("Expired Token");
            console.error(error);

            const refreshT: string = await getToken(decoded.userId);
            const isValid: boolean = verifyRefreshToken(refreshT);

            // User must be triggered to login
            if (!isValid) { 
                return res.status(401).send({ message: "Session expired: Please log in again"});
            }
            // If token is valid then proceed with the request
            // This flow is used with SSR
            next();

        } else if (error instanceof JsonWebTokenError) {
            console.error("Web token error: ", error)
        }
        next(error);
    }
}

export const genRefreshToken = (id: string): string => {
    // console.log("Secret RT: ", secretRefT);
    if (!secretRefT) throw new Error("Missing Token from ENV");

    const refreshToken = jwt.sign({ id: id }, secretRefT, { expiresIn: '1d' });
    
    return refreshToken;
}


export const verifyRefreshToken = (refreshT: string): boolean => {
    try {
        if (!secretRefT) throw new Error("Missing refresh secret");

        const decoded = jwt.verify(refreshT, secretRefT);
        return true;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) { 
            console.log("Expired RefreshT")
            console.error("RefrestT error", error);
            return false
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error("RefrestT error: ", error)
            return false;
        }
        console.error("Jwt Unexpected error", error);
        return false;
    }
}

// const originalRequest = {
//     method: req.method, eg. POST, GET, PATCH
//     url: req.originalUrl, /api/etc
//     headers: req.headers, 
//     body: req.body
// };

// export const expiredAccessToken = async (decoded: DecodedPayload) => {

//     // Rule: The client is better to retry the request and not the server

//     // Error is handled by the middleware caller
//     if (decoded == null) throw new Error("Decoded cannot be null");
//     const userId = decoded.userId;

//     const refreshToken = await getToken(userId);
//     if (!refreshToken) throw new Error("Missing refresh token");
    
// }

// Redis Section
// An example of caching because the state have ttl
// Use JSON.stringify() if storing an object or array
export const saveToken = async (userId: string, token: string) => {
    try {
        const ttl = daysToSeconds({ days: 7 });

        console.log("Saving into redis");
        // prefix user: is a convention so it is easy to find values with keys
        // Redis set does not allow key duplicates it overwrites
        const response = await redisClient.set(`user:${userId}`, token, {
            EX: ttl 
        });

        console.log("Token saved:", response);
    } catch (error) {
        console.error('Failed to save the token:', error);
    }
}

export const getToken = async (userId: string) => {
    try {
        const data = await redisClient.get(`user:${userId}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to get the token:', error);
        return null;
    }
}

export const destroyToken = async (userId: string) => {
    const response = await redisClient.del(`user:${userId}`);
    console.log("Response: ", response);
    return;
}