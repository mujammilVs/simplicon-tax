const User = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const { check, validationResult } = require("express-validator");

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  const { email } = req.body;
  const userFound = await User.find({ email });
  console.log("USER:: ", userFound);
  if (userFound?.length) {
    return res.status(400).json({
      error: "user already exists",
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Error saving user",
      });
    }
    res.json({
      username: user.username,
      email: user.email,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found!",
      });
    }
    // if(!user){
    //     return res.status(401).json({
    //         err:"you don't have an accound please signup!"
    //     })
    // }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "email and password do not match",
      });
    }
    //CREATE TOKEN
    const token = jwt.sign({ _id: user.id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 999 });
    //send response to frontend
    const { username, email, _id } = user;
    res.json({
      token,
      _id,
      user: {
        username,
        email,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signed out succesfully",
  });
};

//Protected Routes

exports.isSignedin = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//
exports.isAuthenticated = (req, res, next) => {
  console.log("Auth user: ", req.auth);
  console.log("Profile user: ", req.profile);
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

// Middleware to allow only authenticated users or admins
exports.isAuthorized = (req, res, next) => {
  const isUserAuthenticated =
    req.profile && req.auth && req.profile._id == req.auth._id;

  if (!isUserAuthenticated) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }

  // Allow access if the user is an admin
  if (req.profile.role === "admin") {
    return next();
  }

  // Default to denying access for non-admin users if more specific logic is required
  next(); // Let authenticated users proceed without restriction
};
