const { check } = require("express-validator");
const validatorMiddleWare = require("../../MiddleWare/ValidatorMiddleWare");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  validatorMiddleWare,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short")
    .isLength({ max: 32 })
    .withMessage("too long"),
    
  validatorMiddleWare,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  validatorMiddleWare,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  validatorMiddleWare,
];
