import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message || 'Something went wrong'
        })
    } else {
        next()
    }
}

export default globalErrorHandler