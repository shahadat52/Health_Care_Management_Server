import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong' || err.message
        })
    } else {
        next()
    }
}

export default globalErrorHandler