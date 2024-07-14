import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "./user.validation";
import { upload } from "../../utils/fileUploder";


const router = express.Router()

router.post(
    '/create-admin',
    upload.single('file'),
    (req, res, next) => {
        const data = JSON.parse(req?.body?.data);
        req.body = data
        next()
    },
    // validateRequest(userValidations.createAdminValidationSchema),
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    userControllers.createAdmin
);

router.post(
    '/create-doctor',
    upload.single('file'),
    (req, res, next) => {
        const data = JSON.parse(req?.body?.data);
        req.body = data
        next()
    },
    validateRequest(userValidations.createDoctorValidationSchema),
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    userControllers.createDoctor
);

router.post(
    '/create-patient',
    upload.single('file'),
    (req, res, next) => {
        const data = JSON.parse(req?.body?.data);
        req.body = data
        next()
    },
    validateRequest(userValidations.createPatientValidationSchema),
    auth(),
    userControllers.createPatient
);

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    userControllers.getAllUsers
);

router.put(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(userValidations.updateStatusValidation),
    userControllers.updateStatus
)


export const userRoutes = router