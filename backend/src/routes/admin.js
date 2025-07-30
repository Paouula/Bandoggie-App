import express from "express"
import adminController from "../controllers/adminController.js"

const router = express.Router()

router.route('/').get(adminController.get)
router.route('/').post(adminController.post)

router.route('/:id').put(adminController.put)
router.route('/:id').delete(adminController.delete)

export default router;