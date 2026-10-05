import express from 'express';
const router = express.Router();
import { createUser, getUsers } from '../controllers/userController.js';

router.post('/register', createUser);
router.get('/users', getUsers);

export default router;
