import { Request, Response, NextFunction } from "express";

// By extending object it allows Arrays and Maps
export const responseHelper = <T extends object>(
    res: Response, 
    statusCode: number, 
    payload: T, // Sending objects is generally better
    options?: { 
        keyName?: string; // Allows Custom payload key name
        metadata?: object; // optional metadata (e.g Access Token)
    }
) => {

    //  Error safety - avoids double send
    if (res.headersSent) {
        console.warn("Response already sent");
        return;
    }
    
    const key = options?.keyName || "payload";

    // Standard format
    const responseBody = {
        statusCode,
        // Use spread operator to destructure from metadata
        ...(options?.metadata || {}),
        [key]: payload,
    };

    res.status(statusCode).json(responseBody);

}  