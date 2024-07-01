import { PrismaClient, UserRole } from "@prisma/client";
const prisma = new PrismaClient()

const createUserInDB = async (data: any) => {
    const userData = {
        name: data.user.name,
        email: data.user.email,
        password: data.password,

    }

    const result = await prisma.$transaction(async (transactionFn) => {
        const createUser = await transactionFn.user.create({
            data: {
                name: data.user.name,
                email: data.user.email,
                password: data.password,
                role: UserRole.ADMIN
            }
        });

        const createAdmin = await transactionFn.admin.create({
            data: {
                email: data.user.email,
                contractNumber: data.user.contractNumber

            }
        })

        return createAdmin
    })
    return result
}

export const userServices = {
    createUserInDB
}