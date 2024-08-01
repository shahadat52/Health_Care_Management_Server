import { date } from "zod";
import { prisma } from "../../../app"
import { userSearchAbleFields } from "../User/user.constant";
import { Prisma } from "@prisma/client";
import calculatePaginationAndSorting from "../../utils/calculatePaginationAndSorting";

const getAllDoctorsFromDB = async (params: any, option: any) => {
    // console.log(query);
    // const result = await prisma.doctor.findMany({
    //     where: {
    //         DoctorSpecialties: {
    //             some: {
    //                 specialties: {
    //                     AND: [
    //                         {
    //                             title: {
    //                                 contains: query.DoctorSpecialties,
    //                                 mode: 'insensitive'
    //                             }
    //                         }
    //                     ]
    //                 }
    //             }
    //         },

    //     },
    //     include: {
    //         DoctorSpecialties: {
    //             include: {
    //                 specialties: true
    //             }
    //         }
    //     }
    // });
    console.log(params);

    const { searchTerm, specialties, ...searchFields } = params
    const { page, limit, sortBy, sortOrder } = calculatePaginationAndSorting(option)
    const andConditions: Prisma.DoctorWhereInput[] = [];


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
    if (specialties && specialties.length > 0) {
        andConditions.push({
            DoctorSpecialties: {
                some: {
                    specialties: {
                        AND: {
                            title: {
                                contains: specialties,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            }

        })
    }
    const total = await prisma.user.count();
    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}
    // console.log(JSON.stringify(whereConditions));
    const result = await prisma.doctor.findMany({
        where: whereConditions,
        include: {
            DoctorSpecialties: {
                include: {
                    specialties: true
                }
            }
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

const getDoctorsByIdFromDB = async (id: string) => {
    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    return {
        data: result
    }
};

const updateDoctorDataInDB = async (id: string, payload: any) => {
    const { specialties, ...doctorData } = payload;
    console.log(specialties);
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    })
    await prisma.$transaction(async (transactionFn) => {
        const doctorDataUpdate = await transactionFn.doctor.update({
            where: {
                id
            },
            data: doctorData,
            include: {
                DoctorSpecialties: true
            }
        });

        if (specialties && specialties.length > 0) {
            const deleteTrue = specialties.filter((specialty: any) => specialty.isDeleted === true)
            for (const specialty of deleteTrue) {
                await transactionFn.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctor.id,
                        specialtiesId: specialty.specialtyId
                    }
                });
            };

            const deleteFalse = specialties.filter((specialty: any) => specialty.isDeleted === false);
            for (const specialty of deleteFalse) {
                await transactionFn.doctorSpecialties.create({
                    data: {
                        doctorId: doctor.id,
                        specialtiesId: specialty.specialtyId
                    }
                });
            }
        }


    });

    const result = await prisma.doctor.findFirst({
        where: {
            id
        },
        include: {
            DoctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    })


    return {
        data: result
    }
};

export const doctorServices = {
    getAllDoctorsFromDB,
    getDoctorsByIdFromDB,
    updateDoctorDataInDB
}