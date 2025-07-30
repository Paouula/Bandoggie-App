import express from "express";
import guestWholesalersController from "../controllers/wholesalersPurchaseController.js";

const router = express.Router();

router
  .route("/")
  .get(guestWholesalersController.getAllGuestWholesalers)
  .post(guestWholesalersController.insertGuestWholesalers);

router
  .route("/:id")
  .put(guestWholesalersController.updateGuestWholesalers)
  .delete(guestWholesalersController.deleteGuestWholesalers);

export default router;