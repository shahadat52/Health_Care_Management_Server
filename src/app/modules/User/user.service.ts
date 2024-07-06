import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";


const saltRounds = 10;
const prisma = new PrismaClient()

const createUserInDB = async (data: any) => {
    const hashPassword = bcrypt.hashSync(data.password, saltRounds)

    const result = await prisma.$transaction(async (transactionFn) => {

        const createAdmin = await transactionFn.user.create({
            data: {
                name: data.user.name,
                email: data.user.email,
                password: hashPassword,
                role: UserRole.ADMIN
            }
        });

        await transactionFn.admin.create({
            data: {
                name: data.user.name,
                email: data.user.email,
                contractNumber: data.user.contractNumber

            }
        })

        return {
            data: createAdmin
        }
    })
    return {
        data: result
    }
}

export const userServices = {
    createUserInDB
}