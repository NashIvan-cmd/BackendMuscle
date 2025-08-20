import { Request, Response, NextFunction } from 'express';

// Global Error Handler Middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    // See the kind of errror we are getting
    // console.log("Error instanceof NotFoundError:", err instanceof NotFoundError);
    console.log("Error prototype:", Object.getPrototypeOf(err));
    console.log("Error.constructor.name:", err.constructor.name);
    console.log("Error keys:", Object.keys(err));
    console.log("err.statusCode:", (err as any).statusCode);


    // Hanldes errors
    if (err instanceof CustomError) {
        const { statusCode, errors, logging } = err;
        if (logging) {
            console.log("Have some logging functionallity here");
        }

        return res.status(statusCode).send({ errors});
    }

    // Unhandled errors
    console.error(err);
    console.error(JSON.stringify(err, null, 2));
    return res.status(500).send({ errors: [{ message: 'Something went wrong' }]});
}

// Custom Errors
type CustomErrorContent = {
    message: string,
    context?: { [key: string]: any }
}

// Custom Error Base Class
// It enforces subclasses to implement specific properties
abstract class CustomError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errors: CustomErrorContent[];
    abstract readonly logging: boolean;

    constructor(message: string) {
        super(message);
        
        // Set the prototype explicitly to maintain the correct prototype chain
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

// Semantically invalid
export class BadRequestError extends CustomError {
    private static readonly _statusCode = 400;
    private readonly _code: number;
    private readonly _logging: boolean;
    private readonly _context: { [key: string]: any };

    constructor(params?: { code?: number, message?: string, logging?: boolean, context?: { [key: string]: any } }) {
        const { code, message, logging, context } = params || {};

        super(message || 'Bad Request');
        this._code = code || BadRequestError._statusCode;
        this._logging = logging || false;
        this._context = context || {};

        // Only because we are extending a built-in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
        
    }

     get errors() {
            return [{ message: this.message, context: this._context }];
    }

    get statusCode() {
        return this._code;
    }

    get logging() {
        return this._logging;
    }
}

export class NotFoundError extends CustomError {
    private readonly _statusCode = 404;
    private readonly _code: number;
    private readonly _logging: boolean;
    private readonly _context: { [key: string]: any };

    constructor(params?: {code?: number, message?: string, logging?: boolean, context?: { [key: string]: any}}) {
        const { code, message, logging, context } = params || {};

        super(message || 'Not Found');
        this._code = code || this._statusCode;
        this._logging = logging || false;
        this._context = context || {};

        // Only because we are extending a built-in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    get errors() {
        return [{ message: this.message, context: this._context }];
    }

    get statusCode() {
        return this._code;
    }

    get logging() {
        return this._logging;
    }

}

// Invalid auth or role access
export class UnauthorizedError extends CustomError {
    private readonly _statusCode = 401
    private readonly _code: number;
    private readonly _logging: boolean;
    private readonly _context: { [key: string]: any };

    constructor(params?: {code?: number, message?: string, logging?: boolean, context?: { [key: string]: any}}) {
        const { code, message, logging, context } = params || {};

        super(message || "Unauthorized Access");
        this._code = code || this._statusCode;
        this._logging = logging || false;
        this._context = context || {};
        
        // This makes sure that this is an UnauthorizedError and not just error
        // Important in JS ES5 and below
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    get errors() {
        return [{ message: this.message, context: this._context }];
    }

    get statusCode() {
        return this._code;
    }

    get logging() {
        return this._logging;
    }
}
