import exp from 'constants';
import express from 'express';
import { authCollections } from './auth.collection';

const router = express.Router();
router.get('/login', authCollections.login)
router.get('/refreshToken', authCollections.refreshToken)

export const authRoutes = router