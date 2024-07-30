import { date } from "zod";
import { prisma } from "../../../app"

const getAllDoctorsFromDB = async () => {
    const result = await prisma.doctor.findMany({});

    return {
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