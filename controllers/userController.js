const asyncHandler = require("express-async-handler");
const User = require("../models/user.js");
const passport = require("passport");
const HashedPassword = require("../public/javascripts/HashPassword.js");
const { body, validationResult } = require("express-validator");

exports.users_get = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password");
  if (users) res.send(Object.values(users));
  else res.send("No Users Found");
});

exports.user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec().select("-password");

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  res.send(Object.values(user));
});

exports.user_sign_in = [
  asyncHandler(async (req, res, next) => {
    try {
      passport.authenticate("local", (err, user, options) => {
        if (!user) {
          return res.json("Log in failed, try again");
          //res.json(options.message);
        }
        req.login(user, (err) => {
          if (err) return next(err);
          const updatedUser = user.toObject();
          delete updatedUser.password;
          return res.status(200).json({
            status: "success",
            user: updatedUser,
            msg: "Signed in successfully",
          });
        });
      })(req, res, next);
    } catch (err) {
      console.log(err);
    }
  }),
];

exports.user_resume_signIn = asyncHandler((req, res) => {
  if (req.user) {
    const noPasswordUser = req.user.toObject();
    delete noPasswordUser.password;
    return res.status(200).json({
      status: "success",
      user: req.user,
      msg: "Resumed previous log in",
    });
  }
  return res.status(200).json({
    status: "failed",
    msg: "No existing sign-in to resume",
  });
});

exports.get_signedInUSer = asyncHandler(async (req, res) => {
  let noPasswordUser = "No sign ins";
  if (req.user) {
    noPasswordUser = req.user.toObject();
    delete noPasswordUser.password;
  }
  return res.status(200).json({
    status: "success",
    currentUser: noPasswordUser,
    users: req.sessionStore.sessions,
    session: req.session,
    msg: "Currently signed in users returned",
  });
});

exports.user_sign_out = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err)
        return res.status(500).json({
          status: "Failed",
          error: err,
          msg: "Session destroy failed",
        });
    });
    res.clearCookie("connect.sid");
    return res.json({
      status: "success",
      user: req.user,
      msg: "Signed out successfully",
    });
  });
});

exports.user_sign_up = [
  body("firstName")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must Enter a first name")
    .isLength({ min: 3, max: 100 })
    .withMessage("First name has to be between 3 to 100 characters"),
  body("lastName")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must enter a last name")
    .isLength({ min: 3, max: 100 })
    .withMessage("Last name has to be bewteen 3 to 100 characters"),
  body("username")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must Enter a username")
    .isLength({ min: 3, max: 100 })
    .withMessage("Username has to be between 3 to 100 characters")
    .custom(async (value) => {
      const user = await User.findOne({ user_name: value }).exec();
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  body("email")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must enter an email")
    .isEmail()
    .withMessage("You must enter an email")
    .isLength({ max: 100 })
    .custom(async (val) => {
      const email = await User.findOne({ email: val }).exec();
      if (email) throw new Error("Email Already in use");
    }),
  body("password")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must enter a password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 charaters"),
  body("phoneNum")
    .exists({ values: "falsy" })
    .withMessage("You must enter a phone number")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Password has to be between 8 to 100 characters"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      user_name: req.body.username.toLowerCase(),
      password: await HashedPassword(req.body.password),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
    });
    if (!errors.isEmpty()) {
      res.json({
        status: "failed",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      await user.save();
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.json({ status: "success", user: userWithoutPassword });
    }
  }),
];
