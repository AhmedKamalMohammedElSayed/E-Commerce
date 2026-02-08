const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const factory = require("./handlerFactory");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../MiddleWare/uploadImageMiddleWare");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${crypto.randomUUID()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/userImage/${filename}`);

    req.body.profileImg = filename;
  }
  next();
});

/**
 * @desc    Get list of users with pagination
 * @route   GET /api/v1/users
 * @access  Public
 *
 * @query   page   Page number (default = 1)
 * @query   limit  Number of users per page (default = 4)
 */
exports.getUsers = factory.getAll(userModel);
/**
 * @desc    Get a single brand by ID
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
exports.getUser = factory.getOne(userModel);
/**
 * @desc    Create a new brand
 * @route   POST /api/v1/users
 * @access  Protected (Admin)
 */
exports.createUser = factory.createOne(userModel);

/**
 * @desc    Update a brand by ID
 * @route   PUT /api/v1/users/:id
 * @access  Protected (Admin)
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const item = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    },
  );

  if (!item) {
    return next(
      new ApiError(`No item found for this id: ${req.params.id}`, 404),
    );
  }
  res.status(200).json({ data: item });
});
/**
 * @desc    Update a brand password by ID
 * @route   PUT /api/v1/users/:id
 * @access  Protected (Admin)
 */
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const item = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!item) {
    return next(
      new ApiError(`No item found for this id: ${req.params.id}`, 404),
    );
  }
  res.status(200).json({ data: item });
});
/**
 * @desc    Delete a brand by ID
 * @route   DELETE /api/v1/users/:id
 * @access  Protected (Admin)
 */
exports.deleteUser = factory.deleteOne(userModel);
