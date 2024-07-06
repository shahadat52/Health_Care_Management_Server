import express from 'express'
import { adminCollections } from './admin.controller';
import exp from 'constants';

const router = express.Router();


router.get('/', adminCollections.getAdmin)
router.put('/:id', adminCollections.updateDataById);
router.delete('/:email', adminCollections.deleteAdmin)
router.put('/soft/:id', adminCollections.softDeleteAdmin)


export const adminRoutes = router