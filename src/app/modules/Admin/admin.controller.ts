import { Request, Response } from "express"
import { adminServices } from "./admin.service"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { searchAbleFields } from "../../constants/admin.constant";
import filterQuery from "../../utils/filterQuery";

const getAdmin = catchAsync(async (req: Request, res: Response) => {

    const filteredQuery = filterQuery(req.query, searchAbleFields)
    const option = filterQuery(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])


    const result = await adminServices.getAdminFromDB(filteredQuery, option)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin data retrieve successfully',
        data: result,
    })

});

export const adminCollections = {
    getAdmin
}