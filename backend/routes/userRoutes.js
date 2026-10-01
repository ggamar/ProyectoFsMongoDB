import express from 'express';
const router = express.Router();
import { createUser, getUser } from '../controllers/userController.js';

router.post('/register', createUser);
router.get('/users', getUser); 

export default router;
