import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const getAdminFromDB = async (data: any) => {
    const result = await prisma.admin.findMany({

    });

    return result
};

export const adminServices = {
    getAdminFromDB
}