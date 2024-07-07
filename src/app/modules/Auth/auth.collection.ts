import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const login = catchAsync(async (req, res) => {
    const { refreshToken, accessToken, needPasswordChange } = await authServices.loginInDB(req.body)
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    })
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User is login successfully',
        data: {
            accessToken,
            needPasswordChange
        },
    })
});


const refreshToken: RequestHandler = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await authServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User is login successfully',
        data: result
    })
})


export const authCollections = {
    login,
    refreshToken
}