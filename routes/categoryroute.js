/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");

const router = express.Router();

// const multer = require("multer");

const subCategoryRoute = require("./subCategoryRoute");
const authService = require('../controller/authService');

router.use("/:categoryId/subCategories", subCategoryRoute);

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controller/categoryService");

// const upload = multer({ dest: "uploads/categoryImage" });

// GET ALL + CREATE
router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo('admin'),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory,
  );

// GET ONE + UPDATE + DELETE
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
