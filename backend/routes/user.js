const express = require("express");
const router = express.Router();

const {getUserById, getUser, getUsers, updateUser} = require("../controller/user");
const {isSignedin, isAuthenticated} = require("../controller/auth");

//MiddleWare
router.param("userId", getUserById);

//GET routes
router.get("/user/:userId",isSignedin, isAuthenticated, getUser);
router.get('/users', getUsers);


//Update Routes
router.put("/user/:userId",isSignedin, isAuthenticated, updateUser);
router.get('/users', getUsers);



module.exports = router;