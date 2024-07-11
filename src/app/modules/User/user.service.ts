import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { sendImageToCloudinary } from "../../utils/fileUploder";
import { TCloudinaryRes } from "../../interface/file";


const saltRounds = 10;
const prisma = new PrismaClient()

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
}

export const userServices = {
    createAdminInDB,
    createDoctorInDB
}