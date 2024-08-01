import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorServices } from "./doctor.service";
import filterQuery from "../../utils/filterQuery";
import { userFilterableFields } from "../User/user.constant";

const getAllDoctors: RequestHandler = catchAsync(async (req, res) => {
    const query = req.query
    const filteredQuery = filterQuery(req.query, userFilterableFields);
    const option = filterQuery(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await doctorServices.getAllDoctorsFromDB(filteredQuery, option)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctors data retrieve successfully',
        data: result.data
    });
});

const getSingleDoctor: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await doctorServices.getDoctorsByIdFromDB(id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor data retrieve successfully',
        data: result.data
    });
});

const updateDoctor: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await doctorServices.updateDoctorDataInDB(id, req.body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor data updated successfully',
        data: result.data
    });
});

export const doctorCollections = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor
}