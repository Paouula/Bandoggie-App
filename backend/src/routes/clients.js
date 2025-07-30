import express from 'express';
import clientsControl from '../controllers/clientsControllers.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'public/' });

router.route('/')
  .get(clientsControl.get)
  .post(upload.single('image'), clientsControl.post);

router.route('/:id')
  .put(upload.single('image'), clientsControl.put)
  .delete(clientsControl.delete);

export default router