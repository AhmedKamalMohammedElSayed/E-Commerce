/* eslint-disable no-undef */
const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../MiddleWare/ValidatorMiddleWare");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  validatorMiddleWare,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Brand name is too short")
    .isLength({ max: 32 })
    .withMessage("Brand name is too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleWare,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  validatorMiddleWare,
];
