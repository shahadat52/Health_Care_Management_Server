import express, { Application, Request, Response } from "express";
import cors from "cors"
import { userRouters } from "./app/modules/User/user.router"

const app: Application = express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.use('/api/v1/user', userRouters)


export default app;