import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../middleware/error.middleware";
import { Egg } from "../models/egg.model";
import { responseHelper } from "../helper/response.helper";
import { dateParser } from "../utils/date.utils";

export const createEgg = async (req: Request, res: Response, next: NextFunction) => {
    const { cookingMethod, bestConsumedBefore } = req.body;
    try {
        if (!cookingMethod) throw new BadRequestError({ code: 400, message: "Missing Cooking method" });

        const bestConsumedDate = dateParser(bestConsumedBefore);
        if (!bestConsumedDate || !(bestConsumedDate instanceof Date)) throw new BadRequestError({ code: 400, message: "Date error" })
            
        const result = await Egg.create({ 
            "cookMethod": cookingMethod,
            bestConsumedBefore: bestConsumedDate
        });

        return responseHelper(res, 401, result);
    } catch (error) {
        next(error);
    }
}