import express from "express"
import employeesControllers from "../controllers/employeesControllers.js"

const router = express.Router()

router.route('/').get(employeesControllers.get)
router.route('/').post(employeesControllers.post)

router.route('/:id').put(employeesControllers.put)
router.route('/:id').delete(employeesControllers.delete)

export default router;