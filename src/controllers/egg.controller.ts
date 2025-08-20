import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../middleware/error.middleware";
import { Egg } from "../models/egg.model";
import { responseHelper } from "../helper/response.helper";
import { dateParser } from "../utils/date.utils";

export const createEgg = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Cooking Start!");
    const { cookingMethod, bestConsumedBefore, ordered } = req.body;
    try {

        const userRole = res.locals.user.role;
        console.log("User Role:", userRole);

        // Fail early, Fail fast
        if (userRole != "chef") throw new UnauthorizedError({ code: 401, message: "Role mismatch" });
        if (!cookingMethod) throw new BadRequestError({ code: 400, message: "Missing Cooking method" });

        const bestConsumedDate = dateParser(bestConsumedBefore);
        if (!bestConsumedDate || !(bestConsumedDate instanceof Date)) throw new BadRequestError({ code: 400, message: "Date error" })
            
        const result = await Egg.create({ 
            "cookMethod": cookingMethod,
            bestConsumedBefore: bestConsumedDate,
            ordered: ordered || false
        });

        return responseHelper(res, 201, result);
    } catch (error) {
        next(error);
    }
}

export const orderEgg = async (req: Request, res: Response, next: NextFunction) => {
    const { orderNumber } = req.body;
    try {
        const userRole = res.locals.user.role;

        if (userRole != "customer") {
            throw new BadRequestError({ code: 400, message: "Only valid customer can order", logging: false })
        }    
        
        const result = await Egg.find({ ordered: false })
            .limit(orderNumber);
        
        if (result.length === 0) {
            return res.send("Currently 0 eggs available");
        }
        const payload = {
            result,
            eggCount: result.length
        }
        return responseHelper(res, 200, payload);
    } catch (error) {
        next(error);
    }
}

// Role based READ
export const getAllEgg = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Egg.find();

        if (result.length == 0) return responseHelper(res, 200, { message: "Empty eggs" });

        const eggCount = result.length;

        const payload = {
            eggCount,
            result
        };

        return responseHelper(res, 200, payload);
    } catch (error) {
        next(error);
    }
}

// expeditor
export const deleteEgg = async (req: Request, res: Response, next: NextFunction) => {
        const { _id } = req.body
    try {
        const userRole = res.locals.user.role;

        if (userRole != 'expeditor') throw new UnauthorizedError({ code: 401, message: "Unauthorized error" });
        
        await Egg.deleteOne({ _id });
    } catch (error) {
        next(error);
    }
}