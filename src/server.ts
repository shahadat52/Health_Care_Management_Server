import { Server } from "http";
import app from "./app";
import seedSuperAdmin from "./app/DB/seedSuperAdmin";


const port = 3000;

async function main() {
    try {
        seedSuperAdmin()
        const server: Server = app.listen(port, () => {
            console.log(`Health care App is running on port ${port}`);
        })
    } catch (error) {
        console.log({ error });
    }
};

main()