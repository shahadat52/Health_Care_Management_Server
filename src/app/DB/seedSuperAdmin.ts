import { PrismaClient } from "@prisma/client"
import { UserRole } from "@prisma/client";
import bcrypt from 'bcrypt'
import config from "../config";
import { prisma } from "../../app";


const superUser = {
    name: 'Shahadat Hossain',
    email: 'sh@gmail.com',
    password: '5234',
    role: UserRole.SUPER_ADMIN,
};
const hashPassword = bcrypt.hashSync(superUser.password, Number(config.salt_round))
superUser.password = hashPassword
const seedSuperAdmin = async () => {
    const isSuperManExists = await prisma.user.findFirst({
        where: {
            role: superUser.role
        }
    });
    if (!isSuperManExists) {
        await prisma.user.create({
            data: superUser
        })
    };
}

export default seedSuperAdmin