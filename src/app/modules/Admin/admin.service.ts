import { Prisma, PrismaClient } from "@prisma/client"
import { searchAbleFields } from "../../constants/admin.constant";

const prisma = new PrismaClient();

const getAdminFromDB = async (params: any) => {
    const { searchTerm, ...searchFields } = params
    const test = Object.keys(searchFields)
    console.log(test);
    const andConditions: Prisma.AdminWhereInput[] = [];
    // [
    //     {
    //         name: {
    //             contains: query.searchTerm,
    //             mode: 'insensitive'
    //         }
    //     },
    //     {
    //         email: {
    //             contains: query.searchTerm,
    //             mode: 'insensitive'
    //         }
    //     }
    // ]
    if (params.searchTerm) {
        andConditions.push({
            OR: searchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(searchFields).length > 0) {
        andConditions.push({
            AND: Object.keys(searchFields).map(key => ({
                [key]: {
                    equals: searchFields[key],
                    mode: 'insensitive'
                }
            }))
        })
    }
    // console.dir(andConditions, { depth: Infinity });

    const makeObject: Prisma.AdminWhereInput = { AND: andConditions }
    const result = await prisma.admin.findMany({
        where: makeObject
    });

    return result
};

export const adminServices = {
    getAdminFromDB
}