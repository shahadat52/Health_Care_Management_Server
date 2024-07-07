import express from 'express';
import { userRoutes } from '../modules/User/user.router';
import { adminRoutes } from '../modules/Admin/admin.route';
import { authRoutes } from '../modules/Auth/auth.route';

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
    }
]
moduleRoutes.forEach((route) => router.use(route.path, route.router))
export default router