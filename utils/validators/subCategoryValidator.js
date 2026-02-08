const { check, body } = require("express-validator");
const slugify = require("slugify");


const validatorMiddleWare = require("../../MiddleWare/ValidatorMiddleWare");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id"),
  validatorMiddleWare,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short")
    .isLength({ max: 32 })
    .withMessage("too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("sub-category must belong to category")
    .isMongoId()
    .withMessage("Invalid Category Id"),
  validatorMiddleWare,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleWare,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id"),
  validatorMiddleWare,
];
