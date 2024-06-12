import Router from 'express';
import { getUSer, verificateUser } from '../controllers/user.controllers.js';

const router = Router();


router.get('/user/:userId', getUSer);
router.post('/user/verificateUser', verificateUser)

export default router;