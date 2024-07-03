import express from 'express'
import { adminCollections } from './admin.controller';
import exp from 'constants';

const router = express.Router();


router.get('/', adminCollections.getAdmin)

export const adminRoutes = router