import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { specialtiesServices } from "./specialties.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
// import httpStatus from 'http-status'

const createSpecialties: RequestHandler = catchAsync(async (req, res) => {
    const result = await specialtiesServices.createSpecialtiesInDB(req.body, req.file);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Specialties Created Successfully',
        data: result
    })
});

export const specialtiesCollections = {
    createSpecialties
}