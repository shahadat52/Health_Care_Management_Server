import exp from 'constants';
import express from 'express';
import { authCollections } from './auth.collection';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();
router.get(
    '/login',
    authCollections.login
);
router.get(
    '/refreshToken',
    authCollections.refreshToken
);
router.put(
    '/change-password',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    authCollections.changePassword
);
router.get(
    '/forget-password',
    authCollections.forgetPassword
);
router.put(
    '/reset-password',
    authCollections.resetPassword
);

export const authRoutes = router


