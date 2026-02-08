const express = require("express");
const authService = require("../controller/authService");

const router = express.Router();

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controller/brandService");

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand,
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand,
  )
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
