import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    const data = req.body;
    const result = await userServices.createUserInDB(data)

    res.send({
        success: true,
        message: result
    })

};

export const userControllers = {
    createUser
}