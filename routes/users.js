var express = require("express");
var router = express.Router();

var userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", userController.users_get);
router.get("/sign-out", userController.user_sign_out);
router.get("/signedInUsers", userController.get_signedInUSer);
router.get("/check", (req, res) => {
  req.isAuthenticated()
    ? res.json("Login persist works")
    : res.json("Persist is not working");
});
router.get("/resumeSignIn", userController.user_resume_signIn);

router.get("/:id", userController.user_detail);

router.post("/sign-in", userController.user_sign_in);
router.post("/sign-up", userController.user_sign_up);

module.exports = router;
