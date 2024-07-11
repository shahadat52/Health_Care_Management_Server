import multer from 'multer'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary';
import path, { resolve } from 'path';
import { rejects } from 'assert';
import { TCloudinaryRes } from '../interface/file';
cloudinary.config({
    cloud_name: 'daahwsoyo',
    api_key: '791441556523834',
    api_secret: 'srio56IFNGkpPN5JcV_GTlJCoW0'
});
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, process.cwd() + '/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)

    }
})
export const upload = multer({ storage: storage })

export const sendImageToCloudinary = async (path: string, fileName: string): Promise<TCloudinaryRes | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            (error: Error, result: TCloudinaryRes) => {
                fs.unlinkSync(path)
                if (error) {
                    reject(error);
                } else {
                    resolve(result)
                }

            },

        );
    });
};
