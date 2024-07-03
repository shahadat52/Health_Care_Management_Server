import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    const result = await prisma.$queryRaw` TRUNCATE "users" CASCADE`
    console.log(result);
}
main()