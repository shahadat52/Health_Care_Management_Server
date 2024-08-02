import express from 'express'
// import auth from '../../middleware/auth';
// import { UserRole } from '@prisma/client';
import { patientCollections } from './patient.collection';

const router = express.Router()

router.get(
    '/',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    patientCollections.getAllPatients
);

router.get(
    '/:id',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    patientCollections.getSinglePatient
);

router.patch(
    '/:id',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    patientCollections.updatePatientData

);



export const patientRoutes = router