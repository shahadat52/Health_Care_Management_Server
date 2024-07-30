import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../modules/Auth/auth.utils";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../app";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) { throw new Error('Unauthorized Access') };

            const decode = verifyToken(token, config.secret_key as string) as JwtPayload
            if (!roles.length && roles.includes(decode?.role)) { throw new Error("Forbidden Access") };

            const isUserExists = await prisma.user.findUniqueOrThrow({
                where: {
                    email: decode?.email
                }
            });

            const status = isUserExists?.status;
            if (status != 'ACTIVE') {
                throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access',)
            }
            req.user = decode
            next()
        } catch (error) {
            next(error)
        }
    }
};

export default auth