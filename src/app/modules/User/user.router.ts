import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";


const router = express.Router()

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    userControllers.createUser
);


export const userRoutes = router