const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const crypto = require("crypto");

const factory = require("./handlerFactory");
const brandModel = require("../models/brandModel");
const { uploadSingleImage } = require("../MiddleWare/uploadImageMiddleWare");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${crypto.randomUUID()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brandImage/${filename}`);

  req.body.image = filename;
  next();
});

/**
 * @desc    Get list of brands with pagination
 * @route   GET /api/v1/brands
 * @access  Public
 *
 * @query   page   Page number (default = 1)
 * @query   limit  Number of brands per page (default = 4)
 */
exports.getBrands = factory.getAll(brandModel);
/**
 * @desc    Get a single brand by ID
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
exports.getBrand = factory.getOne(brandModel);
/**
 * @desc    Create a new brand
 * @route   POST /api/v1/brands
 * @access  Protected (Admin)
 */
exports.createBrand = factory.createOne(brandModel);

/**
 * @desc    Update a brand by ID
 * @route   PUT /api/v1/brands/:id
 * @access  Protected (Admin)
 */
exports.updateBrand = factory.updateOne(brandModel);

/**
 * @desc    Delete a brand by ID
 * @route   DELETE /api/v1/brands/:id
 * @access  Protected (Admin)
 */
exports.deleteBrand = factory.deleteOne(brandModel);
