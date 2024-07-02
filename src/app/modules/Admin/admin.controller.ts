import { Request, Response } from "express"
import { adminServices } from "./admin.service"

const getAdmin = async (req: Request, res: Response) => {
    const result = await adminServices.getAdminFromDB(req.body)
}