import { Prisma, PrismaClient } from "@prisma/client"
import { searchAbleFields } from "../../constants/admin.constant";
import calculatePaginationAndSorting from "../../utils/calculatePaginationAndSorting";

const prisma = new PrismaClient();

const getAdminFromDB = async (params: any, option: any) => {

    const { searchTerm, ...searchFields } = params
    const { page, limit, sortBy, sortOrder } = calculatePaginationAndSorting(option)
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

    // multiple fields exact match korate
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
        where: makeObject,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: option.sortBy && option.sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' }
    });

    return result
};

export const adminServices = {
    getAdminFromDB
}