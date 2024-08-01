
import { Request } from "express";
import { sendImageToCloudinary } from "../../utils/fileUploder";
import { prisma } from "../../../app";

const createSpecialtiesInDB = async (data: any, file: any) => {

    if (file) {
        const fileData = await sendImageToCloudinary(file?.path, file?.filename)
        data.icon = fileData?.secure_url
    }
    console.log(data);
    const result = await prisma.specialties.create({
        data
    })
    console.log(result);
    return result
};

const getAllSpecialtiesFromDB = async () => {
    const result = await prisma.specialties.findMany({})
    return {
        data: result
    }
}

export const specialtiesServices = {
    createSpecialtiesInDB,
    getAllSpecialtiesFromDB
}