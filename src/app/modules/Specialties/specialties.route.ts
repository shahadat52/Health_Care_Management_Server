import express from 'express';
import { upload } from '../../utils/fileUploder';
import { specialtiesCollections } from './specialties.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
    '/',
    upload.single('file'),
    (req, res, next) => {
        const data = JSON.parse(req.body.data)
        req.body = data;
        next()
    },
    specialtiesCollections.createSpecialties
);

router.get(
    '/',
    specialtiesCollections.getAllSpecialties
)
export const specialtiesRouters = router