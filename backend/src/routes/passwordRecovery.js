import express from 'express';
import passwordRecovery from '../controllers/passRecovControllers.js';

const router = express.Router();

router.route('/requestCode').post(passwordRecovery.requestCode)
router.route('/verifyCode').post(passwordRecovery.verifyCode)
router.route('/newPassword').post(passwordRecovery.newPassword)

export default router;