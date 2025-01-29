const { check } = require("express-validator");
const express = require("express");
const router = express.Router();
const { addQuery } = require("../controller/queries");
const { getUserById } = require("../controller/user");

router.param("userId", getUserById);

// CREATE -> Add query
router.post(
  "/queries",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("phone").notEmpty().withMessage("Phone is required"),
    check("details").notEmpty().withMessage("Details are required"),
  ],
  addQuery
);

module.exports = router;