import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client"
import { searchAbleFields } from "../../constants/admin.constant";
import calculatePaginationAndSorting from "../../utils/calculatePaginationAndSorting";

const prisma = new PrismaClient();

const getAdminFromDB = async (params: any, option: any) => {

    const { searchTerm, ...searchFields } = params
    const { page, limit, sortBy, sortOrder } = calculatePaginationAndSorting(option)
    const whereConditions: Prisma.AdminWhereInput[] = [];

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
        whereConditions.push({
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
        whereConditions.push({
            AND: Object.keys(searchFields).map(key => ({
                [key]: {
                    equals: searchFields[key],
                    mode: 'insensitive'
                }
            }))
        })
    }
    // console.dir(andConditions, { depth: Infinity });
    whereConditions.push({
        isDeleted: false
    })
    const total = await prisma.admin.count();
    const makeObject: Prisma.AdminWhereInput = { AND: whereConditions }
    const result = await prisma.admin.findMany({
        where: makeObject,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: option.sortBy && option.sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' }
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result
    }
};

const updateDataByIdInDB = async (id: string, data: Partial<Admin>) => {
    const result = await prisma.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data: data
    })
    console.log(result);
    return {
        data: result
    }
};

const deleteAdminFromDB = async (email: string) => {
    const result = await prisma.$transaction(async (transactionFn) => {
        const deleteAdmin = await transactionFn.admin.delete({
            where: {
                email
            }
        });

        const deleteUser = await transactionFn.user.delete({
            where: {
                email: deleteAdmin?.email
            }
        })
        return {
            deleteAdmin,
            deleteUser
        }
    })
    return {
        data: result
    }
}

const softDeleteAdminFromDB = async (id: string) => {
    const result = await prisma.$transaction(async (transactionFn) => {
        const deleteAdmin = await transactionFn.admin.update({
            where: {
                id,
                isDeleted: false
            },
            data: {
                isDeleted: true
            }
        });
        console.log(deleteAdmin);
        const deleteUser = await transactionFn.user.update({
            where: {
                email: deleteAdmin.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })
        return {
            deleteAdmin,
            deleteUser
        }
    })
    return {
        data: result
    }
}

export const adminServices = {
    getAdminFromDB,
    updateDataByIdInDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB
}