const express = require("express");

const router = express.Router();

const { signUpValidator ,loginValidator} = require("../utils/validators/authValidator");

const { signup ,login, forgetpassword} = require("../controller/authService");

router.route("/signup").post(signUpValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgetPassword").post(forgetpassword);



module.exports = router;
