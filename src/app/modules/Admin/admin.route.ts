import express from 'express'
import { adminCollections } from './admin.controller';
import exp from 'constants';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();


router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminCollections.getAdmin
);
router.put(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminCollections.updateDataById
);
router.delete(
    '/:email',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminCollections.deleteAdmin
);
router.put(
    '/soft/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminCollections.softDeleteAdmin
);


export const adminRoutes = router