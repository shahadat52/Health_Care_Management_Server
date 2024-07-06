import { count } from "console";
import { Response } from "express"

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: {
        page: number,
        limit: number,
        total: number
    }
    data: T | null | undefined;
}
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.statusCode).json({
        statusCode: data?.statusCode,
        success: data?.success,
        message: data?.message,
        meta: data.meta || null || undefined,
        data: data.data || null || undefined
    })
}

export default sendResponse