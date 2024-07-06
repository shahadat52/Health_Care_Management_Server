import express from 'express';
import { userRouters } from '../modules/User/user.router';
import { adminRoutes } from '../modules/Admin/admin.route';

const router = express.Router()

const moduleRoutes = [
    {
        path: '/user',
        router: userRouters
    },
    {
        path: '/admin',
        router: adminRoutes
    }
]

const test = moduleRoutes.forEach((route) => router.use(route.path, route.router))
console.log({ test });
export default router