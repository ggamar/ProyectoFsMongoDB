import express from 'expres';
import {registerUser, loginUser} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
