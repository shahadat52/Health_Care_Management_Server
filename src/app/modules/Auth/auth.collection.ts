import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { send } from "process";

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
});

const changePassword: RequestHandler = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await authServices.changePasswordInDB(payload, user)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password changed successfully',
        data: result
    })
});

const forgetPassword: RequestHandler = catchAsync(async (req, res) => {
    const result = await authServices.forgetPassword(req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password reset Link send successfully',
        data: result
    })
})

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
    const token = req.headers.authorization || ''
    const result = await authServices.resetPassword(token, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password reset successfully',
        data: ''
    })
})


export const authCollections = {
    login,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
}