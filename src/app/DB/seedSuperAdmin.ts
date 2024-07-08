import { PrismaClient } from "@prisma/client"
import { UserRole } from "@prisma/client"

const prisma = new PrismaClient()
const superUser = {
    name: 'Shahadat Hossain',
    email: 'sh@gmail.com',
    password: '5234',
    role: UserRole.SUPER_ADMIN,
}
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