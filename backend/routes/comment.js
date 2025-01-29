const { check } = require("express-validator");
const express = require("express");
const router = express.Router();
const { isSignedin, isAuthenticated } = require("../controller/auth");
const {
  getComments,
  updateComment,
  deleteComment,
  addComment,
} = require("../controller/comment");
const { getUserById } = require("../controller/user");

router.param("userId", getUserById);

//CREATE -> Add comment
router.post(
  "/comments/:userId/:ticketId",
  [
    check("content")
      .isLength({ min: 1 })
      .withMessage("comment content should be atleast 1 character"),
  ],
  isSignedin,
  isAuthenticated,
  addComment
);

//READ -> Get all comments
router.get(
  "/comments/:userId/:ticketId",
  isSignedin,
  isAuthenticated,
  getComments
);

//UPDATE -> Update the comment
router.put(
  "/comments/:userId/:commentId",
  isSignedin,
  isAuthenticated,
  updateComment
);

//DELETE -> delete the comment
router.delete(
  "/comments/:userId/:commentId",
  isSignedin,
  isAuthenticated,
  deleteComment
);

module.exports = router;
