import { Request, Response } from "express"
import { adminServices } from "./admin.service"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"

const getAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.getAdminFromDB(req.query)
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