import { PrismaClient, UserStatus } from "@prisma/client"
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../../config";
import { RequestHandler } from "express";
import { createToken, verifyToken } from "./auth.utils";

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

export const authServices = {
    loginInDB,
    refreshToken
}