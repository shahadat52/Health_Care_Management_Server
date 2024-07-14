import { Server } from "http";
import app from "./app";
import seedSuperAdmin from "./app/DB/seedSuperAdmin";


const port = 3000;
let server: Server;
async function main() {
    try {
        seedSuperAdmin()
        server = app.listen(port, () => {
            console.log(`Health care App is running on port ${port}`);
        })
    } catch (error) {
        console.log({ error });
    }
};

main()

process.on('unhandledRejection', () => {
    console.log(`🤬 UnhandledRejection us detected, Shouting down....`);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1);
});

process.on('uncaughtException', () => {
    console.log(`📴 UncaughtException is detected, Server OFF..`);
    process.exit(1)
});