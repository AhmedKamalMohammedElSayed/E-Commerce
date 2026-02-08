/* eslint-disable no-undef */
const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleWare = require("../../MiddleWare/ValidatorMiddleWare");
const User = require("../../models/userModel");

exports.createUserValidator = [
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

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  validatorMiddleWare,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password"),
  body("passwordConfirm").notEmpty().withMessage("you must enter new password"),
  body("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Erorr("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  validatorMiddleWare,
];
