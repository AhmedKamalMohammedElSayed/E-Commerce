const express = require("express");
const authService = require("../controller/authService");

const router = express.Router({ mergeParams: true });

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../controller/subCategoryService");

// GET ALL + CREATE
router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    setCategoryIdToBody,
    ...createSubCategoryValidator,
    createSubCategory,
  )
  .get(createFilterObj, getSubCategories);
router
  .route("/:id")
  .get(...getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    ...updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    ...deleteSubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;
