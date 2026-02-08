const express = require("express");
const authService = require("../controller/authService");

const router = express.Router();

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeImage,
} = require("../controller/productService");

// GET ALL PRODUCTS + CREATE PRODUCT
router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadProductImages,
    resizeImage,
    createProductValidator,
    createProduct,
  );

// GET ONE PRODUCT + UPDATE + DELETE
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    updateProductValidator,
    updateProduct,
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct,
  );

module.exports = router;
