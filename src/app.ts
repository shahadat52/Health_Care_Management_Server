import express, { Application, Request, Response } from "express";
import cors from "cors"
import { userRoutes } from "./app/modules/User/user.router"
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { adminRoutes } from "./app/modules/Admin/admin.route";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";
import cookieParser from 'cookie-parser'

const app: Application = express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())



app.use('/api/v1', router)

// Global Error Handler
app.use(globalErrorHandler)
app.use(notFound)


export default app;