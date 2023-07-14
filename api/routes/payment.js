const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");

router.get("/",paymentController.sayhello)

router.put("/card", paymentController.addcard)

router.post("/", paymentController.tokenize,paymentController.makepayment)
module.exports = router;