import { Prisma } from "@prisma/client";
import { prisma } from "../../../app";
import calculatePaginationAndSorting from "../../utils/calculatePaginationAndSorting";
import { patientSearchAbleFields } from "./patient.constant";

const getAllPatientsFromDB = async (params: any, option: any) => {
    const { searchTerm, ...searchFields } = params
    // console.log(searchFields);
    const { page, limit, sortBy, sortOrder } = calculatePaginationAndSorting(option)
    const andConditions: Prisma.PatientWhereInput[] = [];

    if (params.searchTerm) {
        andConditions.push({
            OR: patientSearchAbleFields.map(field => ({
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
                    equals: searchFields[key]
                }
            }))
        })
    }
    // console.dir(andConditions, { depth: Infinity });

    const total = await prisma.user.count();
    const whereConditions: Prisma.PatientWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}
    // console.log(JSON.stringify(whereConditions));
    const result = await prisma.patient.findMany({
        where: whereConditions,
        include: {
            MedicalReport: true
        },
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

const getPatientByIdFromDB = async (id: string) => {
    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id
        }
    });

    return {
        data: result
    }
};

const updatePatientData = async (id: string, payload: any) => {
    const result = await prisma.patient.update({
        where: {
            id
        },
        data: payload
    });

    return {
        data: result
    }
}

export const patientServices = {
    getAllPatientsFromDB,
    getPatientByIdFromDB,
    updatePatientData
}