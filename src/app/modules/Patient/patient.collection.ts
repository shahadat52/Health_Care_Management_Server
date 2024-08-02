import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import filterQuery from "../../utils/filterQuery";
import { patientServices } from "./patient.service";
import sendResponse from "../../utils/sendResponse";
import { patientFilterableFields } from "./patient.constant";

const getAllPatients: RequestHandler = catchAsync(async (req, res) => {
    const filteredQuery = filterQuery(req.query, patientFilterableFields);
    console.log(filteredQuery);
    const option = filterQuery(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await patientServices.getAllPatientsFromDB(filteredQuery, option)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patients data retrieve successfully',
        data: result.data
    });
});

const getSinglePatient: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await patientServices.getPatientByIdFromDB(id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient data retrieve successfully',
        data: result.data
    });
});

const updatePatientData: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await patientServices.updatePatientData(id, req.body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient data updated successfully',
        data: result.data
    });
});

export const patientCollections = {
    getAllPatients,
    getSinglePatient,
    updatePatientData
}