import express from 'express';
import registerControl from '../controllers/registerClients.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'public/' });

router.post('/', upload.single('image'), registerControl.register);
router.route("/verifyCodeEmail").post(registerControl.verifyEmail);

export default router;
