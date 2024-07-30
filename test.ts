import { prisma } from "./src/app";


const main = async () => {
    const result = await prisma.$queryRaw` TRUNCATE "users" CASCADE`
    console.log(result);
}
main()