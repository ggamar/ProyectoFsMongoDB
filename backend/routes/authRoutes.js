import express from 'express';
import registerUser from '../controllers/authControllers.js';
import loginUser from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
