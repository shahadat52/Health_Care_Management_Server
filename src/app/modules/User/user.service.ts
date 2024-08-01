import { Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { sendImageToCloudinary } from "../../utils/fileUploder";
import calculatePaginationAndSorting from "../../utils/calculatePaginationAndSorting";
import { userSearchAbleFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { prisma } from "../../../app";


const saltRounds = 10;

const createAdminInDB = async (file: any, data: any) => {
    if (file) {
        const imgData = await sendImageToCloudinary(file.path, file.filename);
        console.log(imgData);
        data.admin.profilePhoto = imgData?.url
    }

    const hashPassword = bcrypt.hashSync(data.password, saltRounds)

    const result = await prisma.$transaction(async (transactionFn) => {

        const createAdmin = await transactionFn.user.create({
            data: {
                name: data.admin.name,
                email: data.admin.email,
                password: hashPassword,
                role: UserRole.ADMIN
            }
        });

        await transactionFn.admin.create({
            data: data.admin
        })

        return {
            data: createAdmin
        }
    })
    return {
        data: result
    }
};

const createDoctorInDB = async (file: any, data: any) => {
    if (file) {
        const imgData = await sendImageToCloudinary(file.path, file.filename);
        data.doctor.profilePhoto = imgData?.url
    }

    const hashPassword = bcrypt.hashSync(data.password, saltRounds)

    const result = await prisma.$transaction(async (transactionFn) => {

        await transactionFn.user.create({
            data: {
                name: data.doctor.name,
                email: data.doctor.email,
                password: hashPassword,
                role: UserRole.ADMIN
            }
        });

        console.log(data.doctor);
        const createAdmin = await transactionFn.doctor.create({
            data: data.doctor
        });
        return {
            data: createAdmin
        }
    })
    return {
        data: result
    }
};

const createPatientInDB = async (file: any, data: any) => {
    if (file) {
        const imgData = await sendImageToCloudinary(file.path, file.filename);
        data.patient.profilePhoto = imgData?.url
    }

    const hashPassword = bcrypt.hashSync(data.password, saltRounds)

    const result = await prisma.$transaction(async (transactionFn) => {

        await transactionFn.user.create({
            data: {
                name: data.patient.name,
                email: data.patient.email,
                password: hashPassword,
                role: UserRole.PATIENT
            }
        });

        console.log(data.doctor);
        const createPatient = await transactionFn.patient.create({
            data: data.patient
        });
        console.log(createPatient);
        return {
            data: createPatient
        }
    });

    return {
        data: result
    }
};

const getAllUsersFromDB = async (params: any, option: any) => {

    const { searchTerm, ...searchFields } = params
    const { page, limit, sortBy, sortOrder } = calculatePaginationAndSorting(option)
    const andConditions: Prisma.UserWhereInput[] = [];


    if (params.searchTerm) {
        andConditions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };


    console.log({ searchFields });
    // multiple fields exact match korate
    if (Object.keys(searchFields).length > 0) {
        andConditions.push({
            AND: Object.keys(searchFields).map(key => ({
                [key]: {
                    equals: searchFields[key]
                }
            }))
        })
    }
    // console.dir(andConditions, { depth: Infinity });
    andConditions.push({
        status: UserStatus.ACTIVE
    })
    const total = await prisma.user.count();
    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}
    // console.log(JSON.stringify(whereConditions));
    const result = await prisma.user.findMany({
        where: whereConditions,
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

const updateStatusInDB = async (id: string, data: any) => {
    console.log(data);
    await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.user.update({
        where: {
            id
        },
        data: {
            status: data.status
        }
    });
    return {
        meta: undefined,
        data: {}
    }

};

const getMyProfileFromDB = async (data: JwtPayload) => {
    console.log(data);
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: data.email
        }
    });

    let userInfo;
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        userInfo = await prisma.admin.findUniqueOrThrow({
            where: {
                email: user.email
            }
        })
    } else if (user.role === 'DOCTOR') {
        userInfo = await prisma.doctor.findUniqueOrThrow({
            where: {
                email: user.email
            }
        })
    } else if (user.role === 'PATIENT') {
        userInfo = await prisma.patient.findUniqueOrThrow({
            where: {
                email: user.email
            }
        })
    }
    console.log({ userInfo });
    return {
        data: { ...user, ...userInfo }
    }
};

const updateProfileInDB = async (userData: JwtPayload, req: Request) => {
    console.log(req.file);
    if (req.file) {
        const file = req.file;
        const imageUrl = await sendImageToCloudinary(file.path, file.filename);
        req.body.profilePhoto = imageUrl?.secure_url
    }
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: userData.email
        }
    });

    let userInfo;
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        userInfo = await prisma.admin.update({
            where: {
                email: user.email
            },
            data: req.body
        })
    } else if (user.role === 'DOCTOR') {
        userInfo = await prisma.doctor.update({
            where: {
                email: user.email
            },
            data: req.body
        })
    } else if (user.role === 'PATIENT') {
        userInfo = await prisma.patient.update({
            where: {
                email: user.email
            },
            data: req.body
        })
    };
    return {
        data: userInfo
    }
}

export const userServices = {
    createAdminInDB,
    createDoctorInDB,
    createPatientInDB,
    getAllUsersFromDB,
    updateStatusInDB,
    getMyProfileFromDB,
    updateProfileInDB
}