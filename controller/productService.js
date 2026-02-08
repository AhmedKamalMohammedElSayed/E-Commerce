const multer = require("multer");
const sharp = require("sharp");
const crypto = require("crypto");

const productModel = require("../models/productModel");
const factory = require("./handlerFactory");
// const ApiError = require("../utils/apiError");
const {uploadMixOfImages} = require('../MiddleWare/uploadImageMiddleWare');

// const multerStorage = multer.memoryStorage();

// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("Only Images allowed"), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
exports.resizeImage = async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `category-${crypto.randomUUID()}-${Date.now()}-cover.jpeg`;

    await sharp(req.file.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/productImage/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageFileName = `category-${crypto.randomUUID()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/productImage/${imageFileName}`);

        req.body.images.push(imageFileName);
      }),
    );
  }

  next();
};
/**
 * @desc    Get list of products with pagination
 * @route   GET /api/v1/products
 * @access  Public
 *
 * @query   page   Page number (default = 1)
 * @query   limit  Number of products per page (default = 4)
 */
exports.getProducts = factory.getAll(productModel);

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProduct = factory.getOne(productModel);

/**
 * @desc    Create new product
 * @route   POST /api/v1/products
 * @access  Protected (Admin)
 */
exports.createProduct = factory.createOne(productModel);
/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Protected (Admin)
 */
exports.updateProduct = factory.updateOne(productModel);

/**
 * @desc    Delete product
 * @route   DELETE /api/v1/products/:id
 * @access  Protected (Admin)
 */
exports.deleteProduct = factory.deleteOne(productModel);
