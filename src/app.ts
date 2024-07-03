import express, { Application, Request, Response } from "express";
import cors from "cors"
import { userRouters } from "./app/modules/User/user.router"
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { adminRoutes } from "./app/modules/Admin/admin.route";

const app: Application = express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.use('/api/v1/user', userRouters)
app.use('/api/v1/admin', adminRoutes)

// Global Error Handler
app.use(globalErrorHandler)


export default app;