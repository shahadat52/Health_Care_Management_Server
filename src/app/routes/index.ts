import express from 'express';
import { userRoutes } from '../modules/User/user.router';
import { adminRoutes } from '../modules/Admin/admin.route';
import { authRoutes } from '../modules/Auth/auth.route';
import path from 'path';
import { specialtiesRouters } from '../modules/Specialties/specialties.route';
import { doctorRoutes } from '../modules/Doctor/doctor.route';
import { patientRoutes } from '../modules/Patient/patient.route';

const router = express.Router()

const moduleRoutes = [
    {
        path: '/user',
        router: userRoutes
    },
    {
        path: '/admin',
        router: adminRoutes
    },
    {
        path: '/auth',
        router: authRoutes
    },
    {
        path: '/doctors',
        router: doctorRoutes
    },
    {
        path: '/patients',
        router: patientRoutes
    },
    {
        path: '/specialties',
        router: specialtiesRouters
    }
]
moduleRoutes.forEach((route) => router.use(route.path, route.router))
export default router