import { Request, Response } from "express"
import { adminServices } from "./admin.service"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import filterQuery from "../../utils/filterQuery";
import { searchTermFields } from "./admin.constant";

const getAdmin = catchAsync(async (req: Request, res: Response) => {

    const filteredQuery = filterQuery(req.query, searchTermFields);
    const option = filterQuery(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])
    const result = await adminServices.getAdminFromDB(filteredQuery, option)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin data retrieve successfully',
        meta: result.meta,
        data: result.data
    })

});

const updateDataById = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await adminServices.updateDataByIdInDB(id, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Data updated successfully',
        data: result,

    })
})

const deleteAdmin = catchAsync(async (req, res) => {
    const { email } = req.params
    const result = await adminServices.deleteAdminFromDB(email);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Deletion successfully',
        data: result,

    })
});

const softDeleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await adminServices.softDeleteAdminFromDB(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User delete successfully',
        data: result,

    })
})

export const adminCollections = {
    getAdmin,
    updateDataById,
    deleteAdmin,
    softDeleteAdmin
}