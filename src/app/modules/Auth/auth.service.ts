import { PrismaClient, UserStatus } from "@prisma/client"
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../../config";
import { RequestHandler } from "express";
import { createToken, verifyToken } from "./auth.utils";
import { checkServerIdentity } from "tls";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();
const loginInDB = async (payload: { email: string, password: string }) => {
    const isUserExists = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload?.email,
            status: UserStatus.ACTIVE
        }
    });
    const payloadData = {
        email: isUserExists?.email,
        role: isUserExists?.role
    }
    const isPasswordValid = await bcrypt.compareSync(payload?.password, isUserExists?.password)
    if (!isPasswordValid) {
        throw Error('Wrong Password')
    }
    const accessToken = createToken(payloadData, (config.secret_key as string), { expiresIn: '1h' })
    const refreshToken = createToken(payloadData, (config.secret_key as string), { expiresIn: '365d' })
    return {
        accessToken,
        refreshToken,
        needPasswordChange: isUserExists?.needPasswordChange
    }
};

const refreshToken = async (token: string) => {
    const decoded = verifyToken(token, (config.secret_key as string)) as JwtPayload;
    const isUserExists = await prisma.user.findUniqueOrThrow({
        where: {
            email: decoded?.email,
            status: UserStatus.ACTIVE
        }
    });

    const payload = {
        email: isUserExists?.email,
        role: isUserExists?.role
    }
    const accessToken = createToken(payload, (config.secret_key as string), { expiresIn: '1h' });
    console.log(accessToken);
    return {
        accessToken
    }
}

const changePasswordInDB = async (payload: { oldPass: string, newPass: string }, decodeData: JwtPayload) => {
    /**
     * find user 
     * match pass
     * change pass
     */
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodeData.email
        }
    });
    const isPasswordValid = await bcrypt.compareSync(payload.oldPass, user.password)

    if (!isPasswordValid) { throw new AppError(StatusCodes.UNAUTHORIZED, 'Incorrect password') };

    const hashPassword = bcrypt.hashSync(payload.newPass, Number(config.salt_round))
    const changePassword = await prisma.user.update({
        where: {
            email: user.email
        },
        data: {
            password: hashPassword
        }
    });
    return {
        changePassword
    }
}
export const authServices = {
    loginInDB,
    refreshToken,
    changePasswordInDB
}