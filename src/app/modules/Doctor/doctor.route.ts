import express from 'express'
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';
import { doctorCollections } from './doctor.collection';

const router = express.Router()

router.get(
    '/',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorCollections.getAllDoctors
);

router.get(
    '/:id',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorCollections.getSingleDoctor
);

router.patch(
    '/:id',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorCollections.updateDoctor
);

export const doctorRoutes = router