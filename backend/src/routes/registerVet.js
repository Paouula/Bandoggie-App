import express from 'express';
import registerVetController from '../controllers/registerVet.js';

const router = express.Router()

router.route('/').post(registerVetController.register);
router.route('/verifyCodeEmail').post(registerVetController.verifyEmail);

export default router;
