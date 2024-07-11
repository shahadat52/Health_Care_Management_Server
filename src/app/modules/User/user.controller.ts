import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createAdminInDB(req.file, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User is created successfully',
        data: result?.data,
    })

});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createDoctorInDB(req.file, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor is created successfully',
        data: result?.data,
    })

});

// const createUser = async (req: Request, res: Response) => {
//     try {
//         const data = req.body;
//         const result = await userServices.createUserInDB(data)

//         res.status(200).json({
//             statusCode: 500,
//             success: true,
//             message: 'User is created successfully',
//         })
//     } catch (error) {
//         res.status(500).json({
//             statusCode: 500,
//             success: true,
//             message: 'Failed to create user',
//             error
//         })
//     }
// }


export const userControllers = {
    createAdmin,
    createDoctor
}