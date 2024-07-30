import express, { Application } from "express";
import cors from "cors"
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";
import cookieParser from 'cookie-parser'
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()
const app: Application = express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/', async (req, res) => {
    // Promise.reject()
})

app.use('/api/v1', router)

// Global Error Handler
app.use(globalErrorHandler)
app.use(notFound)



export default app;