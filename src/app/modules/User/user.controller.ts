import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import filterQuery from "../../utils/filterQuery";
import { searchAbleFields } from "../../constants/admin.constant";

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

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createPatientInDB(req.file, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient is created successfully',
        data: result?.data,
    })

});

const getAllUsers = catchAsync(async (req, res) => {
    const filteredQuery = filterQuery(req.query, searchAbleFields);
    const option = filterQuery(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await userServices.getAllUsersFromDB(filteredQuery, option);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users data retrieve successfully',
        meta: result.meta,
        data: result.data
    });
});


export const userControllers = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers
}