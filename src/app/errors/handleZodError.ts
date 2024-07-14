import { ZodError } from "zod"

export const validationError = (error: ZodError) => {
    return {
        success: false,
        statusCode: 400,
        message: 'Validation Error',
        errorSource: error.issues.map(issue => {
            return {
                path: issue.path[0],
                message: issue.message
            }
        })
    }
}