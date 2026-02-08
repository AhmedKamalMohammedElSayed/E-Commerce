/* eslint-disable no-undef */
const { check } = require("express-validator");
const { default: slugify } = require("slugify");
// const bcrypt = require("bcryptjs");
const validatorMiddleWare = require("../../MiddleWare/ValidatorMiddleWare");
const User = require("../../models/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name is too short")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid E-mail Address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      }),
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password is too short"),
  // .custom((pass,{req})=>{
  //   if(pass !== req.body.passwordConfirm){
  //     throw new Error('Password Confirmation Incorrect');
  //   }
  // }),
  // check("passwordConfirm")
  //   .notEmpty()
  //   .withMessage("password confirm is required"),
  check("phone").optional().isMobilePhone("ar-EG"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleWare,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid E-mail Address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      }),
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password is too short"),
  validatorMiddleWare,
];
