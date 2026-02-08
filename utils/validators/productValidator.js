const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../MiddleWare/ValidatorMiddleWare");
const categoryModel = require("../../models/categorymodel");
const subCategoryModel = require("../../models/subCategory");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 200 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (categoryId) => {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error(`No category for this id: ${categoryId}`);
      }
    }),
  check("subCategory")
    .optional()
    .isArray()
    .withMessage("subCategory must be an array")
    .custom(async (subCategoriesIds, { req }) => {
      const subCategories = await subCategoryModel.find({
        category: req.body.category,
      });

      const subCategoriesIdsInDB = subCategories.map((el) => el._id.toString());

      const checker = (target, arr) => target.every((v) => arr.includes(v));

      if (!checker(subCategoriesIds, subCategoriesIdsInDB)) {
        throw new Error("SubCategory does not belong to category");
      }
    }),

  check("subCategory.*").isMongoId().withMessage("Invalid subCategory ID"),

  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleWare,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleWare,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleWare,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleWare,
];
