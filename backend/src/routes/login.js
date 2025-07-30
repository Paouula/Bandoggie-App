import express from 'express';
import loginController from '../controllers/loginControl.js';

const router = express.Router();

router.post('/', loginController.login);

export default router;