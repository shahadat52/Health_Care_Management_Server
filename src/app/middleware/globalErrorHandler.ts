import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { ZodError, number } from "zod";
import { TErrorSource } from "../interface/error";
import config from "../config";
import { validationError } from "../errors/handleZodError";
import { STATUS_CODES } from "http";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const globalErrorHandler = (err: Error | PrismaClientKnownRequestError, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = 'Something went wrong'
    let errorSource: TErrorSource[] = [
        {
            path: '',
            message: ''
        }
    ];

    const duplicateError = (error: any) => {
        return {
            message: 'Violate Unique Constraint',
            errorSource: [
                {
                    path: `Model: ${error.meta?.modelName}, Field: ${(error?.meta?.target as any).map((field: string) => field)}`,
                    message: 'Violate Unique Constraint',
                }
            ]
        }
    };

    const prismaValidationError = (err: any) => {
        return {
            message: 'Field Missing',
            errorSource: [
                {
                    path: '',
                    message: 'Field Missing',
                }
            ]
        }
    };

    const notFoundError = (err: any) => {
        return {
            message: 'Not found',
            errorSource: [
                {
                    path: '',
                    message: 'Not Found Error',
                }
            ]
        }
    }

    if (err) {
        console.log(err);

        if (err instanceof ZodError) {
            const simplifyError = validationError(err)
            message = simplifyError.message,
                statusCode = simplifyError.statusCode,
                errorSource = simplifyError.errorSource
        } else if (err.name === "TokenExpiredError") {
            message = err.message,
                statusCode = 400,
                errorSource = [
                    {
                        path: err.name,
                        message: err.message
                    }
                ]
        } else if (err.name === "PrismaClientKnownRequestError") {
            const simplifyError = duplicateError(err)
            console.log(simplifyError);
            message = simplifyError.message || "Violate Unique Constraint",
                statusCode = 400,
                errorSource = simplifyError.errorSource
        } else if (err.name === "PrismaClientValidationError") {
            const simplifyError = prismaValidationError(err)
            console.log(simplifyError);
            message = simplifyError.message || "Violate Unique Constraint",
                statusCode = 400,
                errorSource = simplifyError.errorSource
        } else if (err.name === "NotFoundError") {
            const simplifyError = notFoundError(err)
            console.log(simplifyError);
            message = simplifyError.message || "Not Found Error",
                statusCode = StatusCodes.NOT_FOUND,
                errorSource = simplifyError.errorSource
        } else if (err instanceof Error) {
            message = err.message || "Something went",
                statusCode = StatusCodes.UNAUTHORIZED,
                errorSource,
                err
        }


        res.status(statusCode).json({

            success: true,
            message,
            statusCode,
            errorSource,
            err,
            stack: config.node_env === 'Development' ? err?.stack : null


        })

    } else {
        next()
    }


}

export default globalErrorHandler

/**
 * success
 * message
 * errorSource
 * stack
 */