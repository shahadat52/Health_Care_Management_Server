import { AnyZodObject } from "zod"
import catchAsync from "../utils/catchAsync"
import { NextFunction, Request, Response } from "express";


const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next()
        } catch (error) {
            next(error)
        }
    }
};

export default validateRequest