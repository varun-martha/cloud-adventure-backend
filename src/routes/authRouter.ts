import express from 'express';
import { register } from '../controllers/UserController';

const authRouter = express.Router();

authRouter.post('/register', register)

export default authRouter;