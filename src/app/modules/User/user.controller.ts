import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import filterQuery from "../../utils/filterQuery";
import { searchAbleFields } from "../Admin/admin.constant";
import { userFilterableFields, userSearchAbleFields } from "./user.constant";

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
    const filteredQuery = filterQuery(req.query, userFilterableFields);
    const option = filterQuery(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    console.log({ filteredQuery, option });
    const result = await userServices.getAllUsersFromDB(filteredQuery, option);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users data retrieve successfully',
        meta: result.meta,
        data: result.data
    });
});

const updateStatus = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await userServices.updateStatusInDB(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Status update successfully',
        meta: result?.meta,
        data: result?.data
    });
});

const getProfile = catchAsync(async (req, res) => {
    const result = await userServices.getMyProfileFromDB(req.user);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Profile Retrieved successfully',
        data: result?.data
    });
});


const updateProfile = catchAsync(async (req, res) => {
    const result = await userServices.updateProfileInDB(req.user, req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Updated successfully',
        data: result?.data
    });
});



export const userControllers = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    updateStatus,
    getProfile,
    updateProfile
}